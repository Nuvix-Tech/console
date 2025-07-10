import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import * as y from "yup";
import { useToast } from "@nuvix/ui/components";
import { useAppStore } from "@/lib/store";
import { sdkForConsole } from "@/lib/sdk";

const schema = y.object({
  name: y.string().max(256),
});

export const UpdateName = () => {
  const { organization, setOrganization } = useAppStore((s) => s);
  const { addToast } = useToast();

  return (
    <>
      <Form
        initialValues={{
          name: organization?.name,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            const data = await sdkForConsole.organizations.updateName(
              organization?.$id!,
              values.name!,
            );
            addToast({
              variant: "success",
              message: "Organization name has been updated successfully.",
            });
            setOrganization(data);
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
