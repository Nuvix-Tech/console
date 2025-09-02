import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, SubmitButton } from "@/components/others/forms";
import { sdkForConsole } from "@/lib/sdk";
import { Column, NumberInput, Select, useToast } from "@nuvix/ui/components";
import { Group } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React, { useEffect } from "react";
import * as y from "yup";
import { useProjectStore } from "@/lib/store";
import { useTimeUnitPair } from "@/lib/helpers/unit";
import { Label } from "@nuvix/sui/components/label";

const schema = y.object({
  duration: y.number().min(0).optional(),
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
          duration: project?.authDuration,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await projects.updateAuthDuration(project?.$id!, Number(values.duration) ?? 0);
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
              <SessionInput initialValue={project?.authDuration} />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};

export const SessionInput = ({ initialValue }: { initialValue: number }) => {
  const { values, setFieldValue } = useFormikContext<{ duration: number }>();
  const { value, unit, units, setUnit, setValue, baseValue } = useTimeUnitPair(initialValue);

  useEffect(() => {
    const currentUnit = units.find((u) => u.name === unit);
    if (currentUnit) {
      const newBaseValue = value * currentUnit.value;
      if (values.duration !== newBaseValue) {
        setFieldValue("duration", newBaseValue);
      }
    }
  }, [value, unit]);

  return (
    <Group gap={6}>
      <Column gap="4" fillWidth>
        <Label className="ml-1">Length</Label>
        <NumberInput
          label="Length"
          min={0}
          value={value}
          labelAsPlaceholder
          externalyUpdate
          onChange={setValue}
        />
      </Column>
      <Column gap="4" fillWidth>
        <Label className="ml-1">Time Period</Label>
        <Select
          label="Time Period"
          labelAsPlaceholder
          value={unit}
          onSelect={setUnit}
          options={units.map((u) => ({ label: u.name, value: u.name }))}
        />
      </Column>
    </Group>
  );
};
