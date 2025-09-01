import ActionBar from "@/components/editor/SidePanelEditor/ActionBar";
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
import { AttributeIcon } from "./ColumnIcon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AttributeConfigFactory } from "./ColumnConfig";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { SelectField } from "../RowEditor/InputField";
import { cn } from "@nuvix/sui/lib/utils";

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

  const factory = useMemo(
    () =>
      new AttributeConfigFactory(sdk, { name: editorState.schema }, snap.collection, column as any),
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
        await onSave(() => {}, isNewRecord, _column);
      } catch (error) {
        await onSave(() => {}, isNewRecord, _column, error);
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
          <SelectField
            label="Type"
            name=""
            options={ATTRIBUTES.map((attr) => ({
              label: attr.label,
              value: attr.key,
              hasPrefix: <AttributeIcon type={attr.key} />,
            }))}
            placeholder="Select type"
            value={type ?? ""}
            onChange={(e) => onTypeChange(e.target.value)}
            required
            multiple={false}
          />
        )}

        {type && formikConfig && (
          <div className={cn("space-y-6", { "mt-6": !column })}>{formikConfig.formFields}</div>
        )}
      </div>
    </SidePanel>
  );
};

export default ColumnEditor;
