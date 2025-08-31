import { noop } from "lodash";
import { useEffect, useMemo, useState } from "react";

import ActionBar from "../ActionBar";
import HeaderTitle from "./HeaderTitle";
import { DynamicField } from "./InputField";
import { JsonEditor } from "./JsonEditor";
import type { EditValue } from "./RowEditor.types";

import { TextEditor } from "./TextEditor";
import { SidePanel } from "@/ui/SidePanel";
import type { Models } from "@nuvix/console";
import { generateYupSchema } from "../ColumnEditor/utils";
import { useFormik } from "formik";
import { CustomID } from "@/components/_custom_id";
import { generateRowFromCollection } from "./RowEditor.utils";
import ForeignRowSelector from "./ForeignRowSelector/ForeignRowSelector";

export interface RowEditorProps {
  row?: Readonly<Models.Document>;
  selectedCollection: Models.Collection;
  visible: boolean;
  editable?: boolean;
  closePanel: () => void;
  saveChanges: (
    payload: any,
    isNewRecord: boolean,
    configuration: {
      documentId: string;
      rowIdx: number;
    },
    resolve: () => void,
  ) => Promise<void>;
  updateEditorDirty: () => void;
}

const RowEditor = ({
  row,
  selectedCollection,
  visible = false,
  editable = true,
  closePanel = noop,
  saveChanges = async () => {},
  updateEditorDirty = noop,
}: RowEditorProps) => {
  const [selectedValueForTextEdit, setSelectedValueForTextEdit] = useState<EditValue>();
  const [selectedValueForJsonEdit, setSelectedValueForJsonEdit] = useState<EditValue>();

  const [isSelectingForeignKey, setIsSelectingForeignKey] = useState<boolean>(false);
  const [referenceAttr, setReferenceAttr] = useState<Models.AttributeRelationship>();

  const isNewRecord = row === undefined;
  const isEditingText = selectedValueForTextEdit !== undefined;
  const isEditingJson = selectedValueForJsonEdit !== undefined;

  const schema = useMemo(
    () => generateYupSchema(selectedCollection.attributes),
    [selectedCollection.attributes],
  );
  const defaultRow = useMemo(
    () => generateRowFromCollection(selectedCollection),
    [selectedCollection],
  );

  const formik = useFormik({
    initialValues: row || defaultRow,
    validationSchema: schema,
    async onSubmit(values) {
      const configuration = { documentId: undefined as unknown as string, rowIdx: -1 };
      if (!isNewRecord) {
        configuration.documentId = row.$id;
        configuration.rowIdx = row!.idx;
      }
      await saveChanges(values, isNewRecord, configuration, () => {});
    },
  });

  useEffect(() => {
    if (visible) {
      formik.resetForm({ values: row || {} });
    }
  }, [visible]);

  useEffect(() => {
    if (formik.dirty) updateEditorDirty();
  }, [formik.dirty]);

  const onOpenForeignRowSelector = (field: Models.AttributeRelationship) => {
    setIsSelectingForeignKey(true);
    setReferenceAttr(field);
  };

  const onSelectForeignRowValue = (
    diff: { deleted: string[]; addedValues: string[] } | null | string,
  ) => {
    if (referenceAttr !== undefined && diff !== undefined) {
      if (typeof diff === "string") {
        formik.setFieldValue(referenceAttr.key, diff);
      } else {
        if (isNewRecord) {
          formik.setFieldValue(referenceAttr.key, {
            set: diff?.addedValues,
          });
        } else {
          formik.setFieldValue(referenceAttr.key, {
            connect: diff?.addedValues,
            disconnect: diff?.deleted,
          });
        }
      }
    }

    setIsSelectingForeignKey(false);
    setReferenceAttr(undefined);
  };

  return (
    <SidePanel
      size="large"
      key="RowEditor"
      visible={visible}
      header={<HeaderTitle isNewRecord={isNewRecord} collectionName={selectedCollection.name} />}
      className={`transition-all duration-100 ease-in ${
        isEditingText || isEditingJson || isSelectingForeignKey ? " mr-32" : ""
      }`}
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
      <SidePanel.Content>
        <div className="space-y-6 py-6">
          {isNewRecord && <CustomID name="$id" label="Document ID" />}
          {selectedCollection.attributes.map((field) => {
            const commonProps = {
              name: field.key,
              nullable: !field.required,
              isArray: field.array,
              type: (field as any).format || field.type,
              options: (field as unknown as Models.AttributeEnum)?.elements?.map((element) => ({
                value: element,
                label: element,
              })),
              min: (field as Models.AttributeInteger).min,
              max: (field as Models.AttributeInteger).max,
              size: field.size,
            };
            return (
              <DynamicField
                key={field.key}
                {...commonProps}
                orientation="horizontal"
                showAbout
                onEditJson={setSelectedValueForJsonEdit}
                onEditText={setSelectedValueForTextEdit}
                onSelectForeignKey={() => onOpenForeignRowSelector(field as any)}
                isEditable={editable}
              />
            );
          })}
        </div>
      </SidePanel.Content>

      <TextEditor
        visible={isEditingText}
        row={formik.values}
        column={selectedValueForTextEdit?.column ?? ""}
        closePanel={() => setSelectedValueForTextEdit(undefined)}
        onSaveField={(value) => {
          formik.setFieldValue(selectedValueForTextEdit?.column ?? "", value);
          setSelectedValueForTextEdit(undefined);
        }}
        readOnly={!editable}
      />
      <JsonEditor
        visible={isEditingJson}
        row={formik.values}
        column={selectedValueForJsonEdit?.column ?? ""}
        closePanel={() => setSelectedValueForJsonEdit(undefined)}
        onSaveJSON={(value) => {
          formik.setFieldValue(selectedValueForJsonEdit?.column ?? "", value);
          setSelectedValueForJsonEdit(undefined);
        }}
        readOnly={!editable}
      />

      <ForeignRowSelector
        key={`foreign-row-selector-${referenceAttr?.key ?? "null"}`}
        visible={isSelectingForeignKey}
        attribute={referenceAttr}
        onSelect={onSelectForeignRowValue}
        relationship={{
          attribute: referenceAttr!,
          row: formik.values,
        }}
        closePanel={() => {
          setIsSelectingForeignKey(false);
          setReferenceAttr(undefined);
        }}
      />
    </SidePanel>
  );
};

export default RowEditor;
