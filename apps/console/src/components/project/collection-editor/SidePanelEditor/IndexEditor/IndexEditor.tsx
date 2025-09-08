import ActionBar from "@/components/editor/SidePanelEditor/ActionBar";
import HeaderTitle from "./HeaderTitle";
import { useProjectStore } from "@/lib/store";
import { SidePanel } from "@/ui/SidePanel";
import type { Models } from "@nuvix/console";
import { AttributeFormat } from "@/components/project/collection-editor/SidePanelEditor/ColumnEditor/utils";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import { DynamicField } from "../RowEditor/InputField";
import { Column } from "@nuvix/ui/components";
import { InputField, SelectObjectField } from "@/components/others/forms";
import { validationSchema, IndexType } from "./utils";

export interface IndexEditorProps {
  index?: Readonly<Models.Index>;
  selectedCollection: Models.Collection;
  visible: boolean;
  closePanel: () => void;
  updateEditorDirty: () => void;
  onSave: (resolve: any, isNewRecord: boolean, index?: Models.Index, error?: any) => Promise<void>;
}

const IndexEditor = ({
  index,
  selectedCollection,
  visible = false,
  closePanel = () => {},
  updateEditorDirty = () => {},
  onSave,
}: IndexEditorProps) => {
  const { sdk } = useProjectStore();
  const editorState = useCollectionEditorStore();

  const initialType = index?.type as IndexType | undefined;
  const attributes =
    editorState.sidePanel?.type === "index" ? editorState.sidePanel.attributes : undefined;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      key: index?.key ?? `index_${selectedCollection.indexes.length + 1}`,
      type: initialType ?? IndexType.KEY,
      fields:
        (attributes ?? index?.attributes)
          ? (attributes ?? index?.attributes)?.reduce(
              (acc, attr, i) => {
                const order = index?.orders?.[i];
                acc[attr] = order ?? "";
                return acc;
              },
              {} as Record<string, string>,
            )
          : {},
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const isNewRecord = !index;
      if (!isNewRecord) return;
      let _index;
      try {
        const { key, type, fields } = values;
        const attributes = Object.keys(fields ?? {});
        const orders = Object.values(fields ?? {}) as string[];
        const schema = selectedCollection.$schema;

        _index = await sdk.databases.createIndex(
          schema,
          selectedCollection.$id,
          key,
          type as any,
          attributes,
          orders,
        );

        await onSave(() => {}, isNewRecord, _index);
      } catch (error) {
        await onSave(() => {}, isNewRecord, _index, error);
      }
    },
  });

  useEffect(() => {
    if (formik.dirty) updateEditorDirty();
  }, [formik.dirty, updateEditorDirty]);

  return (
    <SidePanel
      hideFooter={!!index}
      size="medium"
      key="IndexEditor"
      visible={visible}
      onConfirm={formik.submitForm}
      header={<HeaderTitle collection={selectedCollection} index={index!} />}
      onCancel={closePanel}
      form={formik}
      customFooter={
        <ActionBar
          backButtonLabel="Cancel"
          applyButtonLabel="Save"
          closePanel={closePanel}
          isInForm
          loading={formik.isSubmitting}
          disableApply={!formik.isValid || !formik.dirty}
        />
      }
    >
      <Column padding="12" fillWidth gap="16">
        <InputField name="key" label="Key" disabled={!!index} />

        <DynamicField
          type={AttributeFormat.Enum}
          name="type"
          disabled={!!index}
          options={[
            { value: "key", label: "Key" },
            { value: "unique", label: "Unique" },
            { value: "fulltext", label: "Fulltext" },
          ]}
        />

        <SelectObjectField
          name="fields"
          portal={false}
          left={{
            label: "Attribute",
            options: [
              { label: "$id", value: "$id" },
              { label: "$createdAt", value: "$createdAt" },
              { label: "$updatedAt", value: "$updatedAt" },
              ...selectedCollection.attributes.map((attr: any) => ({
                label: attr?.key,
                value: attr?.key,
              })),
            ],
          }}
          right={{
            label: "Order",
            options: [
              { label: "Ascending", value: "ASC" },
              { label: "Descending", value: "DESC" },
            ],
          }}
          addText="Add Attribute"
        />
      </Column>
    </SidePanel>
  );
};

export default IndexEditor;
