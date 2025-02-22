import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { CardBox, CardBoxBody, CardBoxDesc, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { getUserPageState } from "@/state/page";
import * as y from "yup";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";

const schema = y.object({
  phone: y
    .string()
    .matches(
      /^\+\d{1,15}$/,
      "Phone number must start with '+' and can have a maximum of 15 digits.",
    )
    .required("Phone number is required"),
});

export const UpdatePhone = () => {
  const { user, _update } = getUserPageState();
  const { sdk } = getProjectState();
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          phone: user?.phone,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk?.users.updatePhone(user?.$id!, values.phone!);
            addToast({
              variant: "success",
              message: "User phone has been updated successfully.",
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
              <CardBoxTitle>Phone</CardBoxTitle>
              <CardBoxDesc>
                Please enter the user's phone number. The phone number must start with '+' and can
                have a maximum of 15 digits, for example: +14155552671.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem >
              <InputField label={"Phone Number"} name="phone" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
