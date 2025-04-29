import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, SubmitButton } from "@/components/others/forms";
import { sdkForConsole } from "@/lib/sdk";
import { NumberInput, Select, useToast } from "@nuvix/ui/components";
import { Group } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import * as y from "yup";
import { useProjectStore } from "@/lib/store";
import { useTimeUnitPair } from "@/lib/helpers/unit";

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
  const { units, value, unit, baseValue, setUnit, setValue } = useTimeUnitPair(values.length);

  const handleValueChange = useCallback(
    (v: number) => {
      setValue(v);
    },
    [setValue, setFieldValue],
  );

  useEffect(() => {
    setFieldValue("length", value);
  }, [baseValue]);

  return (
    <Group gap={6}>
      <NumberInput label="Length" min={0} value={value} onChange={handleValueChange} />
      <Select
        label="Time Period"
        value={unit}
        onSelect={(v) => setUnit(v)}
        options={units.map((u) => ({ label: u.name, value: u.name }))}
      />
    </Group>
  );
};
