import { InputField, InputObjectField, InputTextareaField } from "@/components/others/forms";
import { useFormikContext } from "formik";
import React from "react";
import { PushFormData, Props } from "./_types";
import { FilesSelector } from "@/components/wizard/storage";

export const UpdateMessageTypePush = ({ disabled }: Props) => {
  const { values, setFieldValue } = useFormikContext<PushFormData>();

  return (
    <div className="space-y-4">
      <InputField name="title" label="Title" disabled={disabled} />
      <InputTextareaField
        name="message"
        placeholder="Enter text"
        label="Message"
        lines={5}
        maxLength={1000}
        disabled={disabled}
      />
      <FilesSelector
        mimeType={["png", "jpeg"]}
        disabled={disabled}
        onSelect={(b, f) => {
          if (b && f) {
            setFieldValue("image", `${b.$id}:${f.$id}`);
          } else setFieldValue("image", undefined);
        }}
      />
      <InputObjectField name="data" disabled={disabled} />
    </div>
  );
};
