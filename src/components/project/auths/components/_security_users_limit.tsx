import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, RadioField, SubmitButton } from "@/components/others/forms";
import { sdkForConsole } from "@/lib/sdk";
import { NumberInput, useToast } from "@/ui/components";
import { Badge, HStack, VStack } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React from "react";
import * as y from "yup";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { useProjectStore } from "@/lib/store";

const schema = y.object({
  limit: y.number().min(0).optional(),
  selected: y.string(),
});

export const UsersLimit: React.FC = () => {
  const project = useProjectStore.use.project?.();
  const refresh = useProjectStore.use.update();
  const { projects } = sdkForConsole;
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          selected: project?.authLimit === 0 ? "1" : "2",
          limit: project?.authLimit ?? 0,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await projects.updateAuthLimit(project?.$id!, Number(values.limit) ?? 0);
            addToast({
              variant: "success",
              message: "Users limit updated.",
            });
            await refresh();
            resetForm();
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
  const { values, setFieldValue } = useFormikContext<Record<string, string | number>>();

  return (
    <>
      <HStack gap={4}>
        <RadioGroupItem
          value="2"
          onClick={() => {
            setFieldValue("selected", "2");
            setFieldValue("limit", 100);
          }}
        />
        Limited
        <NumberInput
          min={0}
          disabled={values.selected === "1"}
          value={values.selected === "1" ? 100 : (values.limit as number)}
          onChange={(v) => setFieldValue("limit", Number(v))}
          labelAsPlaceholder
          height="s"
        />
      </HStack>
    </>
  );
};

export const Radio1 = () => {
  const { setFieldValue } = useFormikContext<Record<string, string>>();

  return (
    <>
      <HStack gap={2}>
        <RadioGroupItem
          value="1"
          onClick={() => {
            setFieldValue("limit", 0);
            setFieldValue("selected", "1");
          }}
        />
        Unlimited
        <Badge variant={"surface"}>recommended</Badge>
      </HStack>
    </>
  );
};
