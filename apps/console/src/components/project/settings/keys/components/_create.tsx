import ActionBar from "@/components/editor/SidePanelEditor/ActionBar";
import { FieldWrapper, InputField } from "@/components/others/forms";
import { SidePanel } from "@/ui/SidePanel";
import { Button } from "@nuvix/ui/components";
import { useFormik } from "formik";
import React from "react";
import * as y from "yup";
import { ScopesSelector } from "./_scopes_selector";
import { ExpirySelector } from "./_expiry_selector";
import { sdkForConsole } from "@/lib/sdk";
import { useProjectStore } from "@/lib/store";
import { useQueryClient } from "@tanstack/react-query";
import { rootKeys } from "@/lib/keys";
import { toast } from "sonner";

const schema = y.object({
  name: y.string().required("Name is required"),
  expire: y.date().nullable().min(new Date(), "Expiration date must be in the future"),
  scopes: y.array().of(y.string()).min(1, "At least one scope is required"),
});

export const CreateKeyButton: React.FC = () => {
  const project = useProjectStore.use.project?.();
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      name: "",
      expire: null,
      scopes: [] as string[],
    },
    onSubmit: async (values) => {
      if (!project) return;

      try {
        // Create the API key
        await sdkForConsole.projects.createKey(
          project.$id,
          values.name,
          values.scopes,
          values.expire ?? undefined,
        );

        await queryClient.invalidateQueries({
          queryKey: rootKeys.keys(project.$id),
        });

        toast.success("API key created successfully.");
        setOpen(false);
      } catch (e: any) {
        const message = e?.message || "Something went wrong while creating the API key.";

        toast.error(message);
      }
    },
  });

  React.useEffect(() => {
    formik.resetForm();
  }, [open]);

  return (
    <>
      <SidePanel
        visible={open}
        onOpenChange={setOpen}
        size="xlarge"
        triggerElement={
          <Button variant="primary" size="s">
            Create Key
          </Button>
        }
        header="Create New API Key"
        form={formik}
        customFooter={
          <ActionBar closePanel={() => setOpen(false)} isInForm applyButtonLabel="Create" />
        }
      >
        <SidePanel.Content className="space-y-6 py-6">
          <InputField name="name" label="Name" placeholder="Enter key name" layout="horizontal" />
          <ExpirySelector />
          <FieldWrapper
            name="scopes"
            label="Scopes"
            description="Choose which permission scopes to grant your application. It is best practice to allow only the permissions you need to meet your project goals."
            layout="horizontal"
          >
            <ScopesSelector />
          </FieldWrapper>
        </SidePanel.Content>
      </SidePanel>
    </>
  );
};
