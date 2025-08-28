import { isEmpty, isUndefined, noop } from "lodash";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import ActionBar from "../ActionBar";
import HeaderTitle from "./HeaderTitle";
import type { CollectionField } from "./TableEditor.types";
import {
  generateCollectionField,
  generateCollectionFieldFromCollection,
  validateFields,
} from "./TableEditor.utils";
import { useSearchQuery } from "@/hooks/useQuery";
import { SidePanel } from "@/ui/SidePanel";
import { Input } from "@/components/others/ui";
import type { Models } from "@nuvix/console";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
// import { useSendEventMutation } from "@/data/telemetry/send-event-mutation";
// import { useSelectedOrganization } from "hooks/misc/useSelectedOrganization";

export interface CollectionEditorProps {
  collection?: Models.Collection;
  isDuplicating: boolean;
  visible: boolean;
  closePanel: () => void;
  saveChanges: (
    payload: {
      name: string;
      schema: string;
    },
    isNewRecord: boolean,
    configuration: {
      collectionId?: string;
      isDuplicateRows: boolean;
    },
    resolve: any,
  ) => void;
  updateEditorDirty: () => void;
}

const TableEditor = ({
  collection,
  isDuplicating,
  visible = false,
  closePanel = noop,
  saveChanges = noop,
  updateEditorDirty = noop,
}: CollectionEditorProps) => {
  const snap = useCollectionEditorStore();
  const { selectedSchema } = useQuerySchemaState();
  const isNewRecord = isUndefined(collection);
  // const { mutate: sendEvent } = useSendEventMutation();

  const { params, setQueryParam } = useSearchQuery();
  useEffect(() => {
    if (params.get("create") === "collection" && snap.ui.open === "none") {
      snap.onAddCollection();
      setQueryParam({ ...params, create: undefined });
    }
  }, [snap, params, setQueryParam]);

  const [errors, setErrors] = useState<any>({});
  const [isDuplicateRows, setIsDuplicateRows] = useState<boolean>(false);
  const [tableFields, setTableFields] = useState<CollectionField | undefined>(undefined);

  const onUpdateField = (changes: Partial<CollectionField>) => {
    const updatedTableFields = { ...tableFields, ...changes } as CollectionField;
    setTableFields(updatedTableFields);
    updateEditorDirty();

    const updatedErrors = { ...errors };
    for (const key of Object.keys(changes)) {
      delete updatedErrors[key];
    }
    setErrors(updatedErrors);
  };

  const onSaveChanges = (resolve: any) => {
    if (tableFields) {
      const errors: any = validateFields(tableFields);
      if (errors.columns) {
        toast.error(errors.columns);
      }
      setErrors(errors);

      if (isEmpty(errors)) {
        const payload = {
          name: tableFields.name.trim(),
          schema: selectedSchema,
        };
        const configuration = {
          collectionId: collection?.$id,
          isDuplicateRows: isDuplicateRows,
        };
        saveChanges(payload, isNewRecord, configuration, resolve);
      } else {
        resolve();
      }
    }
  };

  useEffect(() => {
    if (visible) {
      setErrors({});
      setIsDuplicateRows(false);
      if (isNewRecord) {
        const tableFields = generateCollectionField();
        setTableFields(tableFields);
      } else {
        const tableFields = generateCollectionFieldFromCollection(collection, isDuplicating);
        setTableFields(tableFields);
      }
    }
  }, [visible]);

  if (!tableFields) return null;

  return (
    <SidePanel
      size="large"
      key="TableEditor"
      visible={visible}
      header={
        <HeaderTitle
          schema={selectedSchema}
          collection={collection}
          isDuplicating={isDuplicating}
        />
      }
      className={`transition-all duration-100 ease-in`}
      onCancel={closePanel}
      onConfirm={() => (resolve: () => void) => onSaveChanges(resolve)}
      customFooter={
        <ActionBar
          backButtonLabel="Cancel"
          applyButtonLabel="Save"
          closePanel={closePanel}
          applyFunction={(resolve: () => void) => onSaveChanges(resolve)}
        />
      }
    >
      <SidePanel.Content className="space-y-10 py-6">
        <Input
          data-testid="table-name-input"
          label="Name"
          orientation="horizontal"
          type="text"
          errorText={errors.name}
          value={tableFields?.name}
          onChange={(event: any) => onUpdateField({ name: event.target.value })}
        />
      </SidePanel.Content>
    </SidePanel>
  );
};

export default TableEditor;
