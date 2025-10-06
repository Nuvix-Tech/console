import { Form, SubmitButton } from "@/components/others/forms";
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
import { ScopesSelector } from "../../components/_scopes_selector";

const schema = y.object({
  scopes: y.array().of(y.string()).min(1, "At least one scope is required"),
});

export const UpdateScopes = ({ apiKey }: { apiKey: Models.Key }) => {
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
          scopes: apiKey.scopes,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdkForConsole.projects.updateKey(
              project?.$id!,
              apiKey.$id,
              apiKey.name,
              values.scopes,
            );
            addToast({
              variant: "success",
              message: "API key scopes has been updated successfully.",
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
            <CardBoxItem>
              <CardBoxTitle>Scopes</CardBoxTitle>
              <CardBoxDesc>
                Choose which permission scopes to grant your application. It is best practice to
                allow only the permissions you need to meet your project goals.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <ScopesSelector />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
