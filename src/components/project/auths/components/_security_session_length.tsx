import { CardBox, CardBoxBody, CardBoxDesc, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { Form, SubmitButton } from "@/components/others/forms";
import { Field } from "@/components/ui/field";
import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";
import { NumberInputField, NumberInputRoot } from "@/components/ui/number-input";
import { useTimeUnitPair } from "@/lib/helpers/unit";
import { sdkForConsole } from "@/lib/sdk";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";
import { Group } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React from "react";
import * as y from "yup";

const schema = y.object({
  length: y.number().min(0).optional(),
});

export const SessionDuration: React.FC = () => {
  const { project, _update } = getProjectState();
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
            await _update();
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
  const { value, unit, baseValue, setValue, setUnit, units } = useTimeUnitPair(values.length);

  React.useEffect(() => {
    if (baseValue === undefined || baseValue === values.length) return;
    setFieldValue("length", baseValue);
  }, [baseValue]);

  return (
    <Group gap={6}>
      <Field label="Length">
        <NumberInputRoot
          min={0}
          value={value.toString()}
          onValueChange={(e) => setValue(Number(e.value))}
        >
          <NumberInputField />
        </NumberInputRoot>
      </Field>
      <Field label="Time period">
        <NativeSelectRoot>
          <NativeSelectField value={unit} onChange={(e) => setUnit(e.currentTarget.value)}>
            {units.map((u, _) => (
              <option key={_} value={u.name}>
                {u.name}
              </option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>
      </Field>
    </Group>
  );
};
