import { Form, InputTagField, SubmitButton } from "@/components/others/forms";
import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import * as y from "yup";
import { useToast } from "@/ui/components";
import { useProjectStore, useUserStore } from "@/lib/store";

const schema = y.object({
  labels: y.array(y.string().max(256).required()),
});

export const UpdateLabels = () => {
  const sdk = useProjectStore.use.sdk?.();
  const refresh = useUserStore.use.refresh();
  const user = useUserStore.use.user?.();
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          labels: user?.labels ?? [],
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk?.users.updateLabels(user?.$id!, values.labels!);
            addToast({
              variant: "success",
              message: "User labels have been updated successfully.",
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
              <CardBoxTitle>Labels</CardBoxTitle>
              <CardBoxDesc>
                Assign customizable labels to categorize and manage users based on specific
                criteria. New roles will be assigned based on these labels.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <InputTagField
                label={"labels"}
                name="labels"
                description="Only alphanumeric characters are allowed."
                suggestion={["admin", "vip", "pro", "vendor"]}
              />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
