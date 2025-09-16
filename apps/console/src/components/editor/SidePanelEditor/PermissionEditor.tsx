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

export interface PermsEditorProps {
  row?: Readonly<Dictionary<any>>;
  table?: PostgresTable;
  visible: boolean;
  editable?: boolean;
  closePanel: () => void;
  saveChanges: (
    permissions: string[],
    configuration: {
      _id?: string;
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
  const { sdk } = useProjectStore();
  const formik = useFormik({
    initialValues: {
      permissions: row?.$permissions || [],
    },
    enableReinitialize: true,
    validationSchema: schema,
    async onSubmit(values) {
      const configuration = { documentId: undefined as unknown as string, rowIdx: -1 };
      configuration.documentId = row!.$id;
      configuration.rowIdx = row!.idx;
      await saveChanges(values.permissions, configuration);
    },
  });

  useEffect(() => {
    if (visible) {
      formik.resetForm({ values: { permissions: row?.$permissions || [] } });
    }
  }, [visible, row]);

  useEffect(() => {
    if (formik.dirty) updateEditorDirty();
  }, [formik.dirty, row]);

  return (
    <SidePanel
      size="medium"
      key="RowPermissionsEditor"
      visible={visible}
      header={
        <Row vertical="center" gap="s">
          Manage Permissions for Document <IDChip id={row?.$id} hideIcon />
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
        <InformationBox
          icon={"key"}
          title="About Permissions"
          description={`
                            A user requires appropriate permissions at either the table level or row level to access row(s).
                            If no permissions are configured, no user can access the row(s).
                          `}
          urlLabel="Learn more about database permissions"
          url="https://nuvix.com/docs/permissions"
        />
        <PermissionField sdk={sdk} name="permissions" withCreate={!row || !row?._id} />
      </SidePanel.Content>
    </SidePanel>
  );
};

export default PermissionEditor;
