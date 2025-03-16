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
import { useToast } from "@/ui/components";
import { useProjectStore, useUserStore } from "@/lib/store";

const schema = y.object({
  email: y.string().email(),
});

export const UpdateEmail = () => {
  const sdk = useProjectStore.use.sdk?.();
  const refresh = useUserStore.use.refresh();
  const user = useUserStore.use.user?.();
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
