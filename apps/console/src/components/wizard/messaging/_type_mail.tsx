import { CustomID } from "@/components/_custom_id";
import { CardBox } from "@/components/others/card";
import { InputField, InputSwitchField } from "@/components/others/forms";
import { EditorField } from "@/components/others/ui";
import { Column } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React from "react";
import * as y from "yup";

export const emailSchema = y.object().shape({
  subject: y.string().required("Subject is required"),
  id: y.string().min(6).max(36).optional(),
  message: y.string().required("Message is required"),
  html: y.boolean().optional(),
});

export const CreateMessageTypeMail = () => {
  const { values } = useFormikContext<Record<string, string | boolean>>();

  return (
    <>
      <Column>
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
