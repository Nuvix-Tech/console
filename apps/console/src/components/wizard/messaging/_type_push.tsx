import { CustomID } from "@/components/_custom_id";
import { CardBox } from "@/components/others/card";
import { InputField, InputTextareaField } from "@/components/others/forms";
import { Column } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React from "react";
import * as y from "yup";
import { FilesSelector } from "../storage";

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
            <InputField name="title" label="Title" />
            <CustomID label="Message ID" name="id" />
            <InputTextareaField
              name="message"
              placeholder="Enter text"
              label="Message"
              lines={5}
              maxLength={1000}
            />
            <FilesSelector />
          </div>
        </CardBox>
      </Column>
    </>
  );
};
