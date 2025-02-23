import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import * as y from "yup";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";
import { sdkForConsole } from "@/lib/sdk";

const schema = y.object({
  name: y.string().max(256),
});

export const UpdateName = () => {
  const { project, _update } = getProjectState();
  const { addToast } = useToast();
  const { projects } = sdkForConsole;

  return (
    <>
      <Form
        initialValues={{
          name: project?.name,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await projects.update(project?.$id!, values.name!);
            addToast({
              variant: "success",
              message: "Project name has been updated.",
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
            <CardBoxItem>
              <InputField label={"Name"} name="name" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
