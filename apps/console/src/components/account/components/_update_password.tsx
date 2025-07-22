import { Form, InputField, SubmitButton } from "@/components/others/forms";
import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import * as y from "yup";
import { SmartLink, useToast } from "@nuvix/ui/components";
import { useAppStore } from "@/lib/store";
import { sdkForConsole } from "@/lib/sdk";

const schema = y.object({
  old: y.string().required("Old Password is Required"),
  new: y.string().min(8).required("New Password is Required"),
});

export const UpdatePassword = () => {
  const { user, setUser } = useAppStore((s) => s);
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          old: "",
          new: "",
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            const res = await sdkForConsole?.account.updatePassword(values.new, values.old);
            addToast({
              variant: "success",
              message: "Account password has been updated successfully.",
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
              <CardBoxTitle>Password</CardBoxTitle>
              <CardBoxDesc>
                Forgot your password?
                <br />
                <SmartLink href="/auth/recover" unstyled className="text-primary hover:!underline">
                  Recover your password
                </SmartLink>
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <InputField label={"Old Password"} name="old" type="password" />
              <InputField label={"New Passowrd"} name="new" type="password" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
