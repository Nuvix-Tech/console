import { Form, InputSwitchField, SubmitButton } from "@/components/others/forms";
import {
  CardBox,
  CardBoxBody,
  CardBoxItem,
  CardBoxTitle,
  CardBoxDesc,
} from "@/components/others/card";
import * as y from "yup";
import { useToast } from "@nuvix/ui/components";
import { useAppStore } from "@/lib/store";
import { sdkForConsole } from "@/lib/sdk";

const schema = y.object({
  mfa: y.boolean(),
});

export const UpdateMfa = () => {
  const { user, setUser } = useAppStore((s) => s);
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          mfa: user?.mfa,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            const res = await sdkForConsole?.account.updateMFA(values.mfa);
            addToast({
              variant: "success",
              message: "Mfa status has been updated successfully.",
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
              <CardBoxTitle>Multi-factor authentication</CardBoxTitle>
              <CardBoxDesc>
                Enhance your account's security by requiring a second sign-in method.
                <a>Learn more</a>
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <InputSwitchField label={"MFA"} name="mfa" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
