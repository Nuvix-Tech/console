import { CardBox } from "@/components/others/card";
import { InputField, InputSelectField } from "@/components/others/forms";
import { useFormikContext } from "formik";
import React from "react";
import { BaseMessageFormData } from "./_types";

export const Schedule = () => {
  const { values } = useFormikContext<BaseMessageFormData>();
  const disabled = values.schedule !== "schedule";
  return (
    <>
      <CardBox>
        <div className="space-y-4">
          <InputSelectField
            name="schedule"
            placeholder="Select"
            label="Schedule"
            options={[
              { label: "Now", value: "now" },
              { label: "Schedule", value: "schedule" },
            ]}
            portal={false}
          />
          <InputField type="date" name="date" label="Date" disabled={disabled} />
          <InputField
            type="time"
            name="time"
            label="Time"
            min="00:00"
            step="0.001"
            disabled={disabled}
          />
        </div>
      </CardBox>
    </>
  );
};
