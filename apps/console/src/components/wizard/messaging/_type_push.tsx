import { CustomID } from "@/components/_custom_id";
import { CardBox } from "@/components/others/card";
import { InputField, InputTextareaField } from "@/components/others/forms";
import { Column } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React from "react";
import * as y from "yup";
import { FilesSelector } from "../storage";

export const pushSchema = y.object().shape({
  title: y.string().required("Title is required"),
  id: y.string().min(6).max(36).optional(),
  message: y.string().max(1000).required("Message is required"),
  image: y.string().matches(/^[^:]{1,36}:[^:]{1,36}$/, "Image must be in format <bucketId>:<fileId>").optional(),
});

export const CreateMessageTypePush = () => {
  const { values, setFieldValue } = useFormikContext<Record<string, string | boolean>>();

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
            <FilesSelector mimeType={['png', 'jpeg']} onSelect={(b, f) => setFieldValue('image', `${b.$id}:${f.$id}`)} />
          </div>
        </CardBox>
      </Column>
    </>
  );
};
