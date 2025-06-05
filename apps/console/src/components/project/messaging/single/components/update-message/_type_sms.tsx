import { InputTextareaField } from "@/components/others/forms";
import React from "react";
import { Props } from "./_types";

export const UpdateMessageTypeSms = ({ disabled }: Props) => {
  return (
    <InputTextareaField
      name="message"
      placeholder="Enter text"
      label="Message"
      lines={5}
      disabled={disabled}
      maxLength={900}
    />
  );
};
