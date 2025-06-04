import { CustomID } from "@/components/_custom_id";
import { CardBox } from "@/components/others/card";
import { InputTextareaField } from "@/components/others/forms";
import { Column } from "@nuvix/ui/components";
import React from "react";
import { SmsFormData } from "./_types";

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
