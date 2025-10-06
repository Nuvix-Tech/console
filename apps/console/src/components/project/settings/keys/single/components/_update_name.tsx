import { Form, InputField, SubmitButton } from "@/components/others/forms";
import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import * as y from "yup";
import { useToast } from "@nuvix/ui/components";
import { useProjectStore } from "@/lib/store";
import { Models } from "@nuvix/console";
import { useQueryClient } from "@tanstack/react-query";
import { rootKeys } from "@/lib/keys";
import { sdkForConsole } from "@/lib/sdk";

const schema = y.object({
  name: y.string().max(256),
});

export const UpdateName = ({ apiKey }: { apiKey: Models.Key }) => {
  const project = useProjectStore.use.project?.();
  const { addToast } = useToast();

  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: rootKeys.keys(project?.$id!),
    });
    await queryClient.invalidateQueries({
      queryKey: rootKeys.key(project?.$id!, apiKey.$id),
    });
  };

  return (
    <>
      <Form
        initialValues={{
          name: apiKey.name,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdkForConsole.projects.updateKey(
              project?.$id!,
              apiKey.$id,
              values.name,
              apiKey.scopes,
            );
            addToast({
              variant: "success",
              message: "API key name has been updated successfully.",
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
              <CardBoxDesc>
                Choose a name that clearly identifies the api key within your project.
              </CardBoxDesc>
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
