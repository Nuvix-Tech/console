import { toast } from "sonner";

import { useSchemaCreateMutation } from "@/data/database/schema-create-mutation";
import ActionBar from "./ActionBar";
import { SidePanel } from "@/ui/SidePanel";
import { useProjectStore } from "@/lib/store";
import * as y from "yup";
import { Column } from "@nuvix/ui/components";
import { InputField, InputSelectField } from "@/components/others/forms";

interface SchemaEditorProps {
  visible: boolean;
  closePanel: () => void;
}

const schema = y.object({
  name: y.string().required(),
  type: y.string().oneOf(["managed", "unmanaged", "document"]).required(),
  description: y.string().optional(),
});

const SchemaEditor = ({ visible, closePanel }: SchemaEditorProps) => {
  const { project, sdk } = useProjectStore();
  const { mutateAsync: createSchema } = useSchemaCreateMutation();

  const onSaveChanges = (values: y.InferType<typeof schema>): any => {
    if (project === undefined) return console.error("Project is required");
    const { name, type, description } = values;
    if (!name) return toast.error("Name is required");
    if (!type) return toast.error("Type is required");

    return createSchema(
      { projectRef: project.$id, sdk, name, type, description },
      {
        onSuccess: () => {
          closePanel();
          toast.success(`Successfully created schema "${name}"`);
        },
      },
    );
  };

  return (
    <SidePanel
      size="medium"
      key="SchemaEditor"
      visible={visible}
      header={"Create a new schema"}
      className="transition-all duration-100 ease-in"
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
        initialValues: {
          name: "",
          type: "managed",
          description: "",
        },
        onSubmit: (values) => onSaveChanges(values),
      }}
    >
      <>
        <SidePanel.Content>
          <Column paddingY="24" fillWidth gap="24">
            <InputField name="name" label="Name" />
            <InputSelectField
              name="type"
              label="Type"
              portal={false}
              options={[
                { label: "Managed", value: "managed" },
                { label: "Unmanaged", value: "unmanaged" },
                { label: "Document", value: "document" },
              ]}
              placeholder="Select a type"
              description="Managed schemas are automatically managed by the system. Unmanaged schemas are manually managed by the user."
            />
            <InputField
              name="description"
              label="Description"
              placeholder="A short description of the schema"
            />
          </Column>
        </SidePanel.Content>
      </>
    </SidePanel>
  );
};

export default SchemaEditor;
