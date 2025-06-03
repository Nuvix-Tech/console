import { CustomID } from "@/components/_custom_id";
import { CardBox } from "@/components/others/card";
import { InputTextareaField } from "@/components/others/forms";
import { Column } from "@nuvix/ui/components";
import React from "react";
import * as y from "yup";

export const smsSchema = y.object().shape({
  message: y.string().max(900).required("Message is required"),
  id: y.string().min(6).max(36).optional(),
});

export const CreateMessageTypeSms = () => {
  return (
    <>
      <Column>
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
