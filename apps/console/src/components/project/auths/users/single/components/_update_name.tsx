import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import * as y from "yup";
import { useToast } from "@nuvix/ui/components";
import { useProjectStore, useUserStore } from "@/lib/store";

const schema = y.object({
  name: y.string().max(256),
});

export const UpdateName = () => {
  const sdk = useProjectStore.use.sdk?.();
  const refresh = useUserStore.use.refresh();
  const user = useUserStore.use.user?.();
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
              <CardBoxTitle>Name</CardBoxTitle>
            </CardBoxItem>
            <CardBoxItem>
              <InputField label={"Name"} name="name" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
