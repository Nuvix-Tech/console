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
import { ExpirySelector } from "../../components/_expiry_selector";

const schema = y.object({
  expire: y.date().nullable().min(new Date(), "Expiration date must be in the future"),
});

export const UpdateExpire = ({ apiKey }: { apiKey: Models.Key }) => {
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
          expire: apiKey.expire ? new Date(apiKey.expire) : apiKey.expire,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdkForConsole.projects.updateKey(
              project?.$id!,
              apiKey.$id,
              apiKey.name,
              apiKey.scopes,
              values.expire as any,
            );
            addToast({
              variant: "success",
              message: "API key expiry has been updated successfully.",
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
              <CardBoxTitle>Expiration Date</CardBoxTitle>
              <CardBoxDesc></CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <ExpirySelector isVertical />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
