import { CustomID } from "@/components/_custom_id";
import { CardBox } from "@/components/others/card";
import { InputField, InputTextareaField } from "@/components/others/forms";
import { Column } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React from "react";
import { PushFormData } from "./_types";
import { FilesSelector } from "../storage";

export const CreateMessageTypePush = () => {
  const { setFieldValue } = useFormikContext<PushFormData>();

  return (
    <>
      <Column>
        <CardBox>
          <div className="space-y-4">
            <InputField name="title" label="Title" />
            <CustomID label="Message ID" name="id" />
            <InputTextareaField
              name="message"
              placeholder="Enter text"
              label="Message"
              lines={5}
              maxLength={1000}
            />
            <FilesSelector
              mimeType={["image/png", "image/jpeg"]}
              onSelect={(b, f) => {
                if (b && f) {
                  setFieldValue("image", `${b.$id}:${f.$id}`);
                } else setFieldValue("image", undefined);
              }}
              maxSize={1024 * 1024}
            />
          </div>
        </CardBox>
      </Column>
    </>
  );
};
