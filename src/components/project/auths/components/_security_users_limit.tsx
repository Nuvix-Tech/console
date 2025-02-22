import { CardBox, CardBoxBody, CardBoxDesc, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { Form, RadioField, SubmitButton } from "@/components/others/forms";
import { NumberInputField, NumberInputRoot } from "@/components/ui/number-input";
import { Radio } from "@/components/ui/radio";
import { sdkForConsole } from "@/lib/sdk";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";
import { Badge, HStack, VStack } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React from "react";
import * as y from "yup";

const schema = y.object({
  limit: y.number().min(0).optional(),
});

export const UsersLimit: React.FC = () => {
  const { project, _update } = getProjectState();
  const { projects } = sdkForConsole;
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          selected: project?.authLimit === 0 ? "1" : "2",
          limit: project?.authLimit,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await projects.updateAuthLimit(project?.$id!, Number(values.limit) ?? 0);
            addToast({
              variant: "success",
              message: "Users limit updated.",
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
              <CardBoxTitle>Users limit</CardBoxTitle>
              <CardBoxDesc>
                Restrict new user sign-ups for your project, regardless of authentication method.
                User creation and team management remain available via your Nuvix console.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <RadioField name="selected">
                <VStack gap="4" alignItems={"start"}>
                  <Radio1 />
                  <Radio2 />
                </VStack>
              </RadioField>
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};

export const Radio2 = () => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();

  return (
    <Radio value="2">
      <HStack gap={4}>
        Limited
        <NumberInputRoot
          defaultValue="100"
          min={0}
          disabled={values.selected === "1"}
          value={values.selected === "1" ? "100" : undefined}
          onValueChange={(e) => setFieldValue("limit", Number(e.value))}
        >
          <NumberInputField />
        </NumberInputRoot>
      </HStack>
    </Radio>
  );
};

export const Radio1 = () => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();

  return (
    <Radio value="1" onClick={() => setFieldValue("limit", 0)}>
      <HStack gap={6}>
        Unlimited
        <Badge variant={"surface"}>recommended</Badge>
      </HStack>
    </Radio>
  );
};
