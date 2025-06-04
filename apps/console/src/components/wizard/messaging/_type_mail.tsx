import { CustomID } from "@/components/_custom_id";
import { CardBox } from "@/components/others/card";
import { InputField, InputSwitchField } from "@/components/others/forms";
import { EditorField } from "@/components/others/ui";
import { Column } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React from "react";
import { EmailFormData } from "./_types";

export const CreateMessageTypeMail = () => {
  const { values } = useFormikContext<EmailFormData>();

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
