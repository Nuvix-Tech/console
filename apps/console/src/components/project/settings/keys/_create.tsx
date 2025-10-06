import ActionBar from "@/components/editor/SidePanelEditor/ActionBar";
import { FieldWrapper, InputField } from "@/components/others/forms";
import { SidePanel } from "@/ui/SidePanel";
import { Button, DateInput } from "@nuvix/ui/components";
import { useFormik } from "formik";
import React from "react";
import * as y from "yup";

const schema = y.object({
  name: y.string().required("Name is required"),
  expire: y.date().nullable().min(new Date(), "Expiration date must be in the future"),
  scopes: y.array().of(y.string()).min(1, "At least one scope is required"),
});

export const CreateKeyButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      name: "",
      expire: null,
      scopes: [] as string[],
    },
    onSubmit: async (values, { setSubmitting }) => {},
  });

  return (
    <>
      <SidePanel
        triggerElement={
          <Button variant="primary" size="s">
            Create Key
          </Button>
        }
        header="Create New API Key"
        form={formik}
        customFooter={<ActionBar closePanel={() => setOpen(false)} isInForm />}
      >
        <SidePanel.Content className="space-y-6 py-6">
          <InputField name="name" label="Name" placeholder="Enter key name" />
          <FieldWrapper name="expire" label="Expiration Date">
            <DateInput
              id="expire"
              name="expire"
              placeholder="Select expiration date"
              value={formik.values.expire ?? undefined}
              onChange={(date) => formik.setFieldValue("expire", date)}
              onBlur={formik.handleBlur}
              labelAsPlaceholder
              portal={false}
            />
          </FieldWrapper>
        </SidePanel.Content>
      </SidePanel>
    </>
  );
};
