import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, SubmitButton } from "@/components/others/forms";
import { sdkForConsole } from "@/lib/sdk";
import { NumberInput, Select, useToast } from "@/ui/components";
import { Group } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React, { useCallback, useState } from "react";
import * as y from "yup";
import { useProjectStore } from "@/lib/store";

const schema = y.object({
  length: y.number().min(0).optional(),
});

export const SessionDuration: React.FC = () => {
  const project = useProjectStore.use.project?.();
  const refresh = useProjectStore.use.update();
  const { projects } = sdkForConsole;
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          length: project?.authDuration,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await projects.updateAuthDuration(project?.$id!, Number(values.length) ?? 0);
            addToast({
              variant: "success",
              message: "Session duration updated.",
            });
            await refresh();
          } catch (e: any) {
            addToast({
              variant: "danger",
              message: e.message,
            });
          }
        }}
      >
        <CardBox
          actions={
            <>
              <SubmitButton loadingText={"Updating..."}>Update</SubmitButton>
            </>
          }
        >
          <CardBoxBody>
            <CardBoxItem gap={"4"}>
              <CardBoxTitle>Session length</CardBoxTitle>
              <CardBoxDesc>
                If you lower the limit, all currently logged-in users will be automatically logged
                out of the application.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <SessionInput />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};

export const SessionInput = () => {
  const { values, setFieldValue } = useFormikContext<Record<string, number>>();

  // Units definition
  const units = React.useMemo(
    () => [
      { name: "Days", value: 86400 },
      { name: "Hours", value: 3600 },
      { name: "Minutes", value: 60 },
      { name: "Seconds", value: 1 },
    ],
    [],
  );

  // Find the best initial unit for display
  const getBestUnit = useCallback(
    (seconds: number) => {
      if (seconds === 0) return "Seconds";
      const sortedUnits = [...units].sort((a, b) => b.value - a.value);
      for (const unit of sortedUnits) {
        if (seconds % unit.value === 0 && seconds >= unit.value) {
          return unit.name;
        }
      }
      return "Seconds"; // Default to seconds if no exact match
    },
    [units],
  );

  // Initialize state with form value
  const [unit, setUnit] = useState(() => getBestUnit(values.length || 0));

  // Calculate display value based on selected unit
  const displayValue = React.useMemo(() => {
    const unitObj = units.find((u) => u.name === unit);
    if (!unitObj || !values.length) return 0;
    return values.length / unitObj.value;
  }, [values.length, unit, units]);

  // Handle value change from the input
  const handleValueChange = useCallback(
    (newValue: number) => {
      const unitObj = units.find((u) => u.name === unit);
      if (!unitObj) return;

      const newBaseValue = newValue * unitObj.value;
      setFieldValue("length", newBaseValue);
    },
    [unit, units, setFieldValue],
  );

  // Handle unit change from select
  const handleUnitChange = useCallback(
    (newUnit: string) => {
      const oldUnitObj = units.find((u) => u.name === unit);
      const newUnitObj = units.find((u) => u.name === newUnit);
      if (!oldUnitObj || !newUnitObj || values.length === undefined) return;

      // Convert the base value to the new unit
      setUnit(newUnit);
      // No need to update form value since we're just changing the display unit
    },
    [unit, units, values.length],
  );

  return (
    <Group gap={6}>
      <NumberInput label="Length" min={0} value={displayValue} onChange={handleValueChange} />
      <Select
        label="Time Period"
        value={unit}
        onSelect={handleUnitChange}
        options={units.map((u) => ({ label: u.name, value: u.name }))}
      />
    </Group>
  );
};
