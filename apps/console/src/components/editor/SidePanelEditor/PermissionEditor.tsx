import { noop } from "lodash";
import { useEffect } from "react";

import ActionBar from "@/components/editor/SidePanelEditor/ActionBar";
import { SidePanel } from "@/ui/SidePanel";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IDChip } from "@/components/others";
import { PermissionField } from "@/components/others/permissions";
import { useProjectStore } from "@/lib/store";
import { Row, Switch } from "@nuvix/ui/components";
import InformationBox from "@/ui/InformationBox";
import type { PostgresTable } from "@nuvix/pg-meta";
import type { Dictionary } from "./SidePanelEditor.types";
import { useTablePermissionsQuery } from "@/data/table-editor/table-permissions-query";
import { useRowPermissionsQuery } from "@/data/table-rows/row-permissions-query";
import { SkeletonText } from "@nuvix/cui/skeleton";
import AlertError from "@/components/others/ui/alert-error";
import { useSecurityInfoQuery } from "@/data/database-policies/managed-schema-policies";
import { useMutateSecurity } from "@/data/database-policies/managed-schema-policies-mutation";

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
  updateEditorDirty: (is: boolean) => void;
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
  const isRowMode = !!row?._id;

  const {
    data: tablePermissions,
    isLoading: isTpLoading,
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
      enabled: visible && !isRowMode,
    },
  );

  const {
    data: rowPermissions,
    isLoading: isRpLoading,
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
      enabled: visible && isRowMode,
    },
  );

  const { data: securityInfo, isLoading: isSecurityLoading } = useSecurityInfoQuery(
    {
      projectRef: project.$id,
      sdk,
      id: table.id,
      schema: table.schema,
    },
    { enabled: visible && !!table.id },
  );

  const { mutate: updateSecurity, isPending: isSecurityPending } = useMutateSecurity(
    project.$id,
    table.schema,
    table.id,
  );

  // Determine current permissions and loading state
  const currentPermissions = isRowMode ? rowPermissions : tablePermissions;
  const isPermissionsLoading = isRowMode ? isRpLoading : isTpLoading;
  const isPermissionsError = isRowMode ? isRError : isTError;
  const permissionsError = isRowMode ? rerror : terror;

  // Overall loading state
  const isLoading = isPermissionsLoading || isSecurityLoading;
  const hasError = isPermissionsError;

  const formik = useFormik({
    initialValues: {
      permissions: currentPermissions || [],
    },
    enableReinitialize: true,
    validationSchema: schema,
    async onSubmit(values) {
      const configuration = {
        _id: row?._id || table.id,
        schema: table.schema,
        ...(isRowMode && { rowIdx: row?.idx }),
      };
      await saveChanges(values.permissions, configuration);
    },
  });

  useEffect(() => {
    if (visible && currentPermissions) {
      formik.resetForm({
        values: {
          permissions: currentPermissions,
        },
      });
    }
  }, [visible, currentPermissions, securityInfo?.tableEnabled, securityInfo?.rowEnabled]);

  useEffect(() => {
    updateEditorDirty(formik.dirty);
  }, [formik.dirty, updateEditorDirty]);

  function handleToggleRow(enable: boolean) {
    updateSecurity({
      sdk,
      table: table.name,
      enableRow: enable,
    });
  }

  function handleToggleTable(enable: boolean) {
    updateSecurity({
      sdk,
      table: table.name,
      enableTable: enable,
    });
  }

  return (
    <SidePanel
      size="medium"
      key="Table/RowPermissionsEditor"
      visible={visible}
      header={
        <Row vertical="center" gap="s">
          {isRowMode ? (
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
      className="transition-all duration-100 ease-in"
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
      <SidePanel.Content className="px-6 space-y-6 py-3">
        {isLoading && <SkeletonText />}

        {hasError && <AlertError error={permissionsError} subject="Failed to fetch permissions" />}

        {!isLoading && !editable && (
          <InformationBox
            icon="info"
            title="Read-Only Mode"
            description="You do not have the necessary permissions to edit these settings."
          />
        )}
      </SidePanel.Content>

      {!isLoading && !hasError && (
        <>
          <SidePanel.Content className="px-6 pb-6 space-y-6">
            <Switch
              name="tls"
              reverse
              loading={isSecurityPending}
              isChecked={securityInfo?.tableEnabled || securityInfo?.rowEnabled || false}
              onToggle={() => handleToggleTable(!securityInfo?.tableEnabled)}
              label="Table Level Permissions (TLP)"
              description="When enabled, all access to this table will be restricted based on defined permissions."
              disabled={
                !editable || isSecurityLoading || isSecurityPending || securityInfo?.rowEnabled
              }
            />

            <Switch
              name="rls"
              label="Row Level Permissions (RLP)"
              reverse
              loading={isSecurityPending}
              isChecked={securityInfo?.rowEnabled || false}
              onToggle={() => handleToggleRow(!securityInfo?.rowEnabled)}
              description="When enabled, either table level permissions or row level permissions are required to access rows in this table."
              disabled={!editable || isSecurityLoading || isSecurityPending}
            />
          </SidePanel.Content>

          <SidePanel.Separator />

          <SidePanel.Content className="px-6 py-6 space-y-6">
            <InformationBox
              icon="key"
              title="About Permissions"
              description="Database permissions allow you to control access to your data at a granular level. You can assign permissions to users or roles, specifying what actions they can perform on specific tables or rows."
              urlLabel="Learn more about database permissions"
              url="https://nuvix.com/docs/permissions"
            />

            <PermissionField sdk={sdk} name="permissions" withCreate={!isRowMode} />
          </SidePanel.Content>
        </>
      )}
    </SidePanel>
  );
};

export default PermissionEditor;
