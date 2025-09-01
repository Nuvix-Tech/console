import { noop } from "lodash";
import { useEffect } from "react";

import ActionBar from "../ActionBar";
import { SidePanel } from "@/ui/SidePanel";
import type { Models } from "@nuvix/console";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IDChip } from "@/components/others";
import { PermissionField } from "@/components/others/permissions";
import { useProjectStore } from "@/lib/store";
import { Row } from "@nuvix/ui/components";
import { Admonition } from "@/ui/admonition";
import InformationBox from "@/ui/InformationBox";

export interface PermsEditorProps {
  row?: Readonly<Models.Document>;
  collection: Models.Collection;
  visible: boolean;
  editable?: boolean;
  closePanel: () => void;
  saveChanges: (
    permissions: string[],
    configuration: {
      documentId: string;
      rowIdx: number;
    },
  ) => Promise<void>;
  updateEditorDirty: () => void;
}

const schema = Yup.object().shape({
  permissions: Yup.array().of(Yup.string()),
});

const PermissionEditor = ({
  row,
  collection,
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
  }, [visible]);

  useEffect(() => {
    if (formik.dirty) updateEditorDirty();
  }, [formik.dirty]);

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
        {collection.documentSecurity && (
          <>
            <InformationBox
              icon={"key"}
              title="About Permissions"
              description={`
                            A user requires appropriate permissions at either the collection level or document level to access a document.
                            If no permissions are configured, no user can access the document.
                          `}
              urlLabel="Learn more about database permissions"
              url="https://nuvix.com/docs/permissions"
            />
            <PermissionField sdk={sdk} name="permissions" withCreate={false} />
          </>
        )}
        {!collection.documentSecurity && (
          <Admonition
            type="note"
            title="Document-level permissions are disabled for this collection."
          >
            Document-level permissions are currently disabled for this collection. To manage
            permissions for individual documents, please enable document-level security in the
            collection settings.
          </Admonition>
        )}
      </SidePanel.Content>
    </SidePanel>
  );
};

export default PermissionEditor;
