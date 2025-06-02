import { CustomID } from "@/components/_custom_id";
import { CardBox } from "@/components/others/card";
import { InputTextareaField } from "@/components/others/forms";
import { Column } from "@nuvix/ui/components";
import React from "react";
import * as y from "yup";

export const smsSchema = y.object().shape({
  name: y.string().max(56).required("Project name is required"),
  password: y.string().min(6).max(20).required("Database password is required"),
  id: y.string().min(6).max(36).optional(),
});

export const CreateMessageTypeSms = () => {
  return (
    <>
      <Column maxWidth={"xs"}>
        <CardBox>
          <div className="space-y-4">
            <InputTextareaField
              name="message"
              placeholder="Enter text"
              label="Message"
              lines={5}
              maxLength={900}
            />
            <CustomID label="Message ID" name="id" />
          </div>
        </CardBox>
      </Column>
    </>
  );
};
