import { InputField, InputSwitchField } from "@/components/others/forms";
import { EditorField } from "@/components/others/ui";
import { useFormikContext } from "formik";
import React from "react";
import { EmailFormData, Props } from "./_types";

export const UpdateMessageTypeMail = ({ disabled }: Props) => {
  const { values } = useFormikContext<EmailFormData>();

  return (
    <>
      <div className="space-y-4">
        <InputField name="subject" label="Subject" disabled={disabled} />
        <EditorField
          name="message"
          label="Message"
          options={{
            readOnly: disabled,
          }}
          language={values["html"] ? "html" : "markdown"}
        />
        <InputSwitchField
          disabled={disabled}
          name="html"
          label={"HTML mode"}
          description="Enable the HTML mode if your message contains HTML tags."
        />
      </div>
    </>
  );
};
