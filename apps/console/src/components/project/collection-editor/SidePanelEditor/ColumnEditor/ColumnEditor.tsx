import ActionBar from "../ActionBar";
import HeaderTitle from "./HeaderTitle";
import { useProjectStore } from "@/lib/store";
import { useParams } from "next/navigation";
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
  onSave: (resolve: any, column?: Models.AttributeString, error?: any) => Promise<void>;
}

const ColumnEditor = ({
  column,
  selectedCollection,
  visible = false,
  closePanel = () => {},
  updateEditorDirty = () => {},
  onSave,
}: ColumnEditorProps) => {
  const { id: ref } = useParams();
  const { project, sdk } = useProjectStore();
  const editorState = useCollectionEditorStore();
  const snap = useCollectionEditorCollectionStateSnapshot();

  const initialType = column?.type as Attributes | AttributeFormat | undefined;
  const [type, setType] = useState<Attributes | AttributeFormat | undefined>(initialType);

  const factory = useMemo(
    () => new AttributeConfigFactory(sdk, { name: editorState.schema }, snap.collection),
    [sdk, editorState.schema, snap.collection],
  );

  const [formikConfig, setFormikConfig] = useState<
    ReturnType<AttributeConfigFactory["getConfig"]> | undefined
  >();

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
    initialValues: formikConfig?.initialValues || {},
    validationSchema: formikConfig?.validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // HREE WE GO----------------
        setSubmitting(false);
        // WE HAVE TO INVALIDATE CACHES,
        onSave(() => {});
      } catch (error) {
        // HERE WE HAVE TO SHOW TOAST
        onSave(() => {}, undefined, error);
        setSubmitting(false);
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
        />

        {type && formikConfig && <div className="space-y-6 mt-6">{formikConfig.formFields}</div>}
      </div>
    </SidePanel>
  );
};

export default ColumnEditor;
