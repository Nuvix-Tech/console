import { isUndefined, noop } from "lodash";
import { useEffect, useState } from "react";

import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import ActionBar from "../../../../editor/SidePanelEditor/ActionBar";
import HeaderTitle from "./HeaderTitle";
import { useSearchQuery } from "@/hooks/useQuery";
import { SidePanel } from "@/ui/SidePanel";
import type { Models } from "@nuvix/console";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
// import { useSendEventMutation } from "@/data/telemetry/send-event-mutation";
// import { useSelectedOrganization } from "hooks/misc/useSelectedOrganization";
import * as y from "yup";
import { FieldWrapper, InputField, InputSwitchField } from "@/components/others/forms";
import { CustomID } from "@/components/_custom_id";
import { PermissionField } from "@/components/others/permissions";
import { useProjectStore } from "@/lib/store";
import { useFormikContext } from "formik";

export interface CollectionEditorProps {
  collection?: Models.Collection;
  isDuplicating: boolean;
  visible: boolean;
  closePanel: () => void;
  saveChanges: (
    payload: Models.Collection,
    isNewRecord: boolean,
    configuration: {
      collectionId?: string;
      isDuplicateRows: boolean;
    },
    resolve: any,
  ) => void;
  updateEditorDirty: () => void;
}

const schema = y.object({
  id: y.string(),
  name: y.string().required(),
  enabled: y.boolean().default(true).required(),
  documentSecurity: y.boolean().default(false),
  $permissions: y.array().of(y.string()),
});

const TableEditor = ({
  collection,
  isDuplicating,
  visible = false,
  closePanel = noop,
  saveChanges = noop,
  updateEditorDirty = noop,
}: CollectionEditorProps) => {
  const snap = useCollectionEditorStore();
  const { selectedSchema } = useQuerySchemaState("doc");
  const isNewRecord = isUndefined(collection);
  // const { mutate: sendEvent } = useSendEventMutation();

  const { params, setQueryParam } = useSearchQuery();
  useEffect(() => {
    if (params.get("create") === "collection" && snap.ui.open === "none") {
      snap.onAddCollection();
      setQueryParam({ ...Object.fromEntries(params.entries()), create: undefined });
    }
  }, [snap, params, setQueryParam]);

  const [isDuplicateRows, setIsDuplicateRows] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      setIsDuplicateRows(false);
    }
  }, [visible]);

  return (
    <SidePanel
      size="large"
      key="TableEditor"
      visible={visible}
      header={
        <HeaderTitle
          schema={selectedSchema ?? ""}
          collection={collection}
          isDuplicating={isDuplicating}
        />
      }
      className={`transition-all duration-100 ease-in`}
      onCancel={closePanel}
      customFooter={
        <ActionBar
          backButtonLabel="Cancel"
          applyButtonLabel="Save"
          closePanel={closePanel}
          isInForm
        />
      }
      form={{
        validationSchema: schema,
        initialValues: isNewRecord
          ? {
              id: "",
              name: "",
              enabled: true,
              documentSecurity: false,
              permissions: [],
            }
          : collection,
        dirty: isDuplicating,
        onSubmit: (values) => {
          const payload = {
            ...values,
            $id: isNewRecord || isDuplicating ? values.id : collection.$id,
          };
          return new Promise((resolve) => {
            saveChanges(
              payload,
              isNewRecord,
              {
                collectionId: collection?.$id,
                isDuplicateRows,
              },
              resolve,
            );
          });
        },
      }}
    >
      <Fields
        isDuplicating={isDuplicating}
        isNewRecord={isNewRecord}
        updateEditorDirty={updateEditorDirty}
      />
    </SidePanel>
  );
};

const Fields = (props: {
  isNewRecord: boolean;
  isDuplicating: boolean;
  updateEditorDirty: Function;
}) => {
  const sdk = useProjectStore.use.sdk();
  const { dirty, values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    if (dirty) {
      props.updateEditorDirty();
    }
  }, [dirty, props]);

  useEffect(() => {
    if (props.isDuplicating) {
      setFieldValue("id", "");
      setFieldValue("name", values.name ? `${values.name} (Copy)` : "");
    }
  }, [props.isDuplicating]);

  return (
    <SidePanel.Content className="space-y-6 py-6">
      {(props.isNewRecord || props.isDuplicating) && <CustomID name="id" label="Collection ID" />}
      <InputField name="name" label="Name" layout="horizontal" />
      <InputSwitchField name="enabled" label={"Enabled"} layout="horizontal" />
      <FieldWrapper name="$permissions" label="Permissions" layout="horizontal">
        <PermissionField name="$permissions" sdk={sdk} withCreate />
      </FieldWrapper>
      <InputSwitchField
        name="documentSecurity"
        label={"Document Security"}
        layout="horizontal"
        descriptionSide="right"
        description={
          <>
            When document security is enabled, users can access documents if they have either
            document-specific permissions or collection-level permissions.
            <br /> <br />
            If document security is disabled, access is granted only through collection permissions,
            and document-specific permissions are ignored.
          </>
        }
      />
    </SidePanel.Content>
  );
};

export default TableEditor;
