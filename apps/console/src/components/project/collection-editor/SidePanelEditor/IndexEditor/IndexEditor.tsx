import ActionBar from "../ActionBar";
import HeaderTitle from "./HeaderTitle";
import { useProjectStore } from "@/lib/store";
import { SidePanel } from "@/ui/SidePanel";
import type { Models } from "@nuvix/console";
import {
  ATTRIBUTES,
  AttributeFormat,
  type AttributeTypes,
  Attributes,
} from "@/components/project/collection-editor/SidePanelEditor/ColumnEditor/utils";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { DynamicField, SelectField } from "../RowEditor/InputField";
import * as y from "yup";
import { Column } from "@nuvix/ui/components";
import { InputField, SelectObjectField } from "@/components/others/forms";

export interface ColumnEditorProps {
  column?: Readonly<AttributeTypes>;
  selectedCollection: Models.Collection;
  visible: boolean;
  closePanel: () => void;
  updateEditorDirty: () => void;
  onSave: (
    resolve: any,
    isNewRecord: boolean,
    column?: Models.AttributeString,
    error?: any,
  ) => Promise<void>;
}

const ColumnEditor = ({
  column,
  selectedCollection,
  visible = false,
  closePanel = () => {},
  updateEditorDirty = () => {},
  onSave,
}: ColumnEditorProps) => {
  const { sdk } = useProjectStore();
  const editorState = useCollectionEditorStore();
  const snap = useCollectionEditorCollectionStateSnapshot();

  const initialType = column?.type as Attributes | AttributeFormat | undefined;
  const [type, setType] = useState<Attributes | AttributeFormat | undefined>(initialType);

  useEffect(() => {
    setType(visible ? initialType : undefined);
  }, [visible]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      key: "",
      type: "key",
      fields: {},
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const isNewRecord = !column;
      let _column;
      try {
        // if (!isNewRecord) {
        //   _column = await formikConfig?.updateAction(column.key, values);
        // } else {
        //   _column = await formikConfig?.submitAction(values);
        // }

        //   try {
        //     const { key, type, fields } = values;

        //     const attributes = Object.keys(fields);
        //     const orders = Object.values(fields) as string[];

        //     await sdk.databases.createIndex(
        //       database?.$id!,
        //       collection.$id,
        //       key,
        //       type,
        //       attributes,
        //       orders,
        //     );

        //     addToast({
        //       message: "Index created successfully",
        //       variant: "success",
        //     });

        //     if (refetch) await refetch();
        //     onClose();
        //   } catch (error: any) {
        //     addToast({
        //       message: error.message,
        //       variant: "danger",
        //     });
        //   }
        // },
        await onSave(() => {}, isNewRecord, _column);
      } catch (error) {
        await onSave(() => {}, isNewRecord, _column, error);
      }
    },
  });

  useEffect(() => {
    if (formik.dirty) updateEditorDirty();
  }, [formik.dirty, updateEditorDirty]);

  return (
    <SidePanel
      size="medium"
      key="ColumnEditor"
      visible={visible}
      onConfirm={formik.submitForm}
      header={<HeaderTitle collection={selectedCollection} attribute={column!} />}
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
      <Column paddingY="12" fillWidth gap="16">
        <InputField name="key" label="Key" />

        <DynamicField
          type={AttributeFormat.Enum}
          name="type"
          options={[
            { value: "key", label: "Key" },
            { value: "unique", label: "Unique" },
            { value: "fulltext", label: "Fulltext" },
          ]}
        />

        <SelectObjectField
          name="fields"
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

const validationSchema = y.object({
  key: y.string().required("Key is required"),
  type: y.string().oneOf(["key", "unique", "fulltext"]).required("Index type is required"),
  fields: y
    .object()
    .test("is-valid-sort-field", "Each attribute must have a valid sort order", (value) => {
      if (!value || Object.keys(value).length < 1) {
        return false;
      }

      return Object.values(value).every((item) => {
        return item === "ASC" || item === "DESC";
      });
    }),
});

export default ColumnEditor;
