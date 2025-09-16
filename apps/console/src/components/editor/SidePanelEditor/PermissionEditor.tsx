import { noop } from "lodash";
import { useEffect } from "react";

import ActionBar from "@/components/editor/SidePanelEditor/ActionBar";
import { SidePanel } from "@/ui/SidePanel";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IDChip } from "@/components/others";
import { PermissionField } from "@/components/others/permissions";
import { useProjectStore } from "@/lib/store";
import { Row } from "@nuvix/ui/components";
import InformationBox from "@/ui/InformationBox";
import type { PostgresTable } from "@nuvix/pg-meta";
import type { Dictionary } from "./SidePanelEditor.types";
import { useTablePermissionsQuery } from "@/data/table-editor/table-permissions-query";
import { useRowPermissionsQuery } from "@/data/table-rows/row-permissions-query";
import { SkeletonText } from "@nuvix/cui/skeleton";
import AlertError from "@/components/others/ui/alert-error";

export interface PermsEditorProps {
  row?: Readonly<Dictionary<any>>;
  table: PostgresTable;
  visible: boolean;
  editable?: boolean;
  closePanel: () => void;
  saveChanges: (
    permissions: string[],
    configuration: {
      _id: number;
      schema: string;
      rowIdx?: number;
    },
  ) => Promise<void>;
  updateEditorDirty: () => void;
}

const schema = Yup.object().shape({
  permissions: Yup.array().of(Yup.string()),
});

const PermissionEditor = ({
  row,
  table,
  visible = false,
  editable = true,
  closePanel = noop,
  saveChanges = async () => {},
  updateEditorDirty = noop,
}: PermsEditorProps) => {
  const { sdk, project } = useProjectStore();
  const {
    data: tablePermissions,
    isLoading: isTpLoading,
    isPending: isTpPending,
    isError: isTError,
    error: terror,
  } = useTablePermissionsQuery(
    {
      projectRef: project.$id,
      table: table.name,
      schema: table.schema,
      sdk,
    },
    {
      enabled: visible && !row?._id,
    },
  );
  const {
    data: rowPermissions,
    isLoading: isRpLoading,
    isPending: isRpPending,
    isError: isRError,
    error: rerror,
  } = useRowPermissionsQuery(
    {
      projectRef: project.$id,
      table: table.name,
      schema: table.schema,
      rowId: row?._id,
      sdk,
    },
    {
      enabled: visible && !!row?._id,
    },
  );

  const formik = useFormik({
    initialValues: {
      permissions: row ? rowPermissions || [] : tablePermissions || [],
    },
    enableReinitialize: true,
    validationSchema: schema,
    async onSubmit(values) {
      const configuration = { rowIdx: -1 } as any;
      configuration._id = row?._id;
      configuration.rowIdx = row?.idx;
      configuration.schema = table.schema;
      await saveChanges(values.permissions, configuration);
    },
  });

  useEffect(() => {
    if (visible) {
      formik.resetForm({
        values: {
          permissions: row ? rowPermissions || [] : tablePermissions || [],
        },
      });
    }
  }, [visible, row, tablePermissions, rowPermissions]);

  useEffect(() => {
    if (formik.dirty) updateEditorDirty();
  }, [formik.dirty, row]);

  return (
    <SidePanel
      size="medium"
      key="Table/RowPermissionsEditor"
      visible={visible}
      header={
        <Row vertical="center" gap="s">
          {row ? (
            <>
              Manage Permissions for Row <IDChip id={row?._id} hideIcon />
            </>
          ) : (
            <>
              Manage Permissions for Table <IDChip id={table.name} hideIcon />
            </>
          )}
        </Row>
      }
      className={`transition-all duration-100 ease-in`}
      onCancel={closePanel}
      form={formik}
      customFooter={
        <ActionBar
          backButtonLabel="Cancel"
          applyButtonLabel="Save"
          closePanel={closePanel}
          hideApply={!editable}
          isInForm
        />
      }
    >
      <SidePanel.Content className="px-6 space-y-6 py-6">
        {(isTpLoading || isRpLoading) && <SkeletonText />}
        {(isTError || isRError) && (
          <AlertError error={terror || rerror} subject="Failed to fetch permissions" />
        )}
        {!(isTpLoading || isRpLoading) && !editable && (
          <InformationBox
            icon={"info"}
            title="Read-Only Mode"
            description="You do not have the necessary permissions to edit these settings."
          />
        )}
        {!(isTpPending && isRpPending) && !(isTError || isRError) && (
          <>
            <InformationBox
              icon={"key"}
              title="About Permissions"
              description={`Database permissions allow you to control access to your data at a granular level. You can assign permissions to users or roles, specifying what actions they can perform on specific tables or rows.`}
              urlLabel="Learn more about database permissions"
              url="https://nuvix.com/docs/permissions"
            />
            <PermissionField sdk={sdk} name="permissions" withCreate={!row || !row?._id} />
          </>
        )}
      </SidePanel.Content>
    </SidePanel>
  );
};

export default PermissionEditor;
