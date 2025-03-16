import { Form, InputField, SubmitButton } from "@/components/others/forms";
import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import * as y from "yup";
import { useToast } from "@/ui/components";
import { useProjectStore, useTeamStore } from "@/lib/store";

const schema = y.object({
  name: y.string().max(256),
});

export const UpdateName = () => {
  const sdk = useProjectStore.use.sdk?.();
  const refresh = useTeamStore.use.refresh();
  const team = useTeamStore.use.team?.();
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          name: team?.name,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk?.teams.updateName(team?.$id!, values.name!);
            addToast({
              variant: "success",
              message: "Team name has been updated successfully.",
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
