import { Form, InputField, SubmitButton } from "@/components/others/forms";
import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { getUserPageState } from "@/state/page";
import { Code } from "@chakra-ui/react";
import * as y from "yup";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";

const schema = y.object({
  email: y.string().email(),
});

export const UpdateEmail = () => {
  const { user, _update } = getUserPageState();
  const { sdk } = getProjectState();
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          email: user?.email,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk?.users.updateEmail(user?.$id!, values.email!);
            addToast({
              variant: "success",
              message: "User email has been updated successfully.",
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
              <CardBoxTitle>Email</CardBoxTitle>
              <CardBoxDesc>
                Update user's email. An Email should be formatted as:{" "}
                <Code variant={"surface"}>name@example.com</Code>.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <InputField label={"Email"} name="email" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
