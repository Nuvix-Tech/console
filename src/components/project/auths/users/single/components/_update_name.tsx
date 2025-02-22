import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { getUserPageState } from "@/state/page";
import * as y from "yup";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";

const schema = y.object({
  name: y.string().max(256),
});

export const UpdateName = () => {
  const { user, _update } = getUserPageState();
  const { sdk } = getProjectState();
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          name: user?.name,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk?.users.updateName(user?.$id!, values.name!);
            addToast({
              variant: "success",
              message: "User name has been updated successfully.",
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
              <CardBoxTitle>Name</CardBoxTitle>
            </CardBoxItem>
            <CardBoxItem >
              <InputField label={"Name"} name="name" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
