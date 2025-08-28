import ActionBar from "../ActionBar";
import HeaderTitle from "./HeaderTitle";
import { useProjectStore } from "@/lib/store";
import { SidePanel } from "@/ui/SidePanel";
import type { Models } from "@nuvix/console";
import {
  ATTRIBUTES,
  type AttributeFormat,
  type AttributeTypes,
  Attributes,
} from "@/components/project/collection-editor/SidePanelEditor/ColumnEditor/utils";
import { useFormik } from "formik";
import { AttributeIcon } from "./_attribute_icon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Select } from "@/components/others/ui";
import { AttributeConfigFactory } from "./ColumnConfig";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";

export interface ColumnEditorProps {
  column?: Readonly<AttributeTypes>;
  selectedCollection: Models.Collection;
  visible: boolean;
  closePanel: () => void;
  updateEditorDirty: () => void;
  onSave: (resolve: any, isNewRecord: boolean, column?: Models.AttributeString, error?: any) => Promise<void>;
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

  const factory = useMemo(
    () => new AttributeConfigFactory(sdk, { name: editorState.schema }, snap.collection, column as any),
    [sdk, editorState.schema, snap.collection, column],
  );

  const [formikConfig, setFormikConfig] = useState<
    ReturnType<AttributeConfigFactory["getConfig"]> | undefined
  >();

  useEffect(() => {
    setType(visible ? initialType : undefined);
  }, [visible]);

  useEffect(() => {
    if (type) {
      const state = factory.getConfig(type);
      if (state) {
        setFormikConfig(state);
      }
    } else {
      setFormikConfig(undefined);
    }
  }, [type, factory]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: column
      ? { ...formikConfig?.initialValues, ...column }
      : formikConfig?.initialValues || {},
    validationSchema: formikConfig?.validationSchema,
    onSubmit: async (values) => {
      const isNewRecord = !column;
      let _column;
      try {
        if (!isNewRecord) {
          _column = await formikConfig?.updateAction(column.key, values);
        } else {
          _column = await formikConfig?.submitAction(values);
        }
        onSave(() => {}, isNewRecord, _column);
      } catch (error) {
        onSave(() => {}, isNewRecord, _column, error);
      }
    },
  });

  useEffect(() => {
    if (formik.dirty) updateEditorDirty();
  }, [formik.dirty, updateEditorDirty]);

  const onTypeChange = useCallback((v: string) => {
    setType(v as Attributes | AttributeFormat);
  }, []);

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
      <div className="p-4">
        {!column && (
          <Select
            label="Type"
            options={ATTRIBUTES.map((attr) => ({
              label: attr.label,
              value: attr.key,
              icon: AttributeIcon(attr.key),
            }))}
            placeholder="Select type"
            value={type ?? ""}
            onValueChange={onTypeChange}
            required
            multiple={false}
            className="mb-6"
          />
        )}

        {type && formikConfig && <div className="space-y-6">{formikConfig.formFields}</div>}
      </div>
    </SidePanel>
  );
};

export default ColumnEditor;
