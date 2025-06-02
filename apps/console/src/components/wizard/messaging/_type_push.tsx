import { CustomID } from "@/components/_custom_id";
import { CardBox } from "@/components/others/card";
import { InputField, InputSwitchField } from "@/components/others/forms";
import { EditorField } from "@/components/others/ui";
import { Column } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React from "react";
import * as y from "yup";

export const pushSchema = y.object().shape({
  name: y.string().max(56).required("Project name is required"),
  password: y.string().min(6).max(20).required("Database password is required"),
  id: y.string().min(6).max(36).optional(),
});

export const CreateMessageTypePush = () => {
  const { values } = useFormikContext<Record<string, string | boolean>>();

  return (
    <>
      <Column maxWidth={"xs"}>
        <CardBox>
          <div className="space-y-4">
            <InputField name="subject" label="Subject" />
            <CustomID label="Message ID" name="id" />
            <EditorField
              name="message"
              label="Message"
              language={values["html"] ? "html" : "markdown"}
            />
            <InputSwitchField
              name="html"
              label={"HTML mode"}
              description="Enable the HTML mode if your message contains HTML tags."
            />
          </div>
        </CardBox>
      </Column>
    </>
  );
};
