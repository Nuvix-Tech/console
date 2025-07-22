import { Form, InputField, SubmitButton } from "@/components/others/forms";
import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Code } from "@chakra-ui/react";
import * as y from "yup";
import { useToast } from "@nuvix/ui/components";
import { useAppStore } from "@/lib/store";
import { sdkForConsole } from "@/lib/sdk";
import { useFormikContext } from "formik";

const schema = y.object({
  email: y.string().email(),
  password: y.string().min(8).required(),
});

export const UpdateEmail = () => {
  const { user, setUser } = useAppStore((s) => s);
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          email: user?.email,
          password: "",
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            const res = await sdkForConsole?.account.updateEmail(values.email, values.password);
            addToast({
              variant: "success",
              message: "Your email has been updated successfully.",
            });
            setUser(res);
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
              <CardBoxTitle>Email</CardBoxTitle>
            </CardBoxItem>
            <CardBoxItem>
              <InputField label={"Email"} name="email" />
              <PasswordField />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};

const PasswordField = () => {
  const { dirty } = useFormikContext();

  if (!dirty) return;
  return <InputField label={"Passowrd"} name="password" type="password" />;
};
