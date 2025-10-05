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
import { Models, PlatformType } from "@nuvix/console";
import { useQueryClient } from "@tanstack/react-query";
import { rootKeys } from "@/lib/keys";
import { sdkForConsole } from "@/lib/sdk";

const schema = y.object({
  name: y.string().max(256),
});

export const UpdatePlatform = ({ platform }: { platform?: Models.Platform }) => {
  const project = useProjectStore.use.project?.();
  const { addToast } = useToast();

  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: rootKeys.platforms(project?.$id!),
    });
    await queryClient.invalidateQueries({
      queryKey: rootKeys.platform(project?.$id!, platform?.$id!),
    });
  };

  return (
    <>
      <Form
        initialValues={{
          name: platform?.name,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdkForConsole.projects.updatePlatform(
              project?.$id!,
              platform?.$id!,
              values.name!,
            );
            addToast({
              variant: "success",
              message: "Platform name has been updated successfully.",
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
              <CardBoxTitle>Platform Configuration</CardBoxTitle>
              <CardBoxDesc>Update your platform configuration settings.</CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              {[PlatformType.Web, PlatformType.Flutterweb].includes(
                platform?.type! as PlatformType,
              ) && (
                <InputField
                  name="hostname"
                  label="Hostname"
                  placeholder="example.com"
                  description="Enter the domain where this platform will be deployed (can be wildcard domain like *.example.com)"
                />
              )}

              {[
                PlatformType.Appleios,
                PlatformType.Applemacos,
                PlatformType.Applewatchos,
                PlatformType.Appletvos,
                PlatformType.Flutterios,
                PlatformType.Flutterandroid,
                PlatformType.Flutterlinux,
                PlatformType.Fluttermacos,
                PlatformType.Flutterwindows,
                PlatformType.Android,
                PlatformType.Reactnativeios,
                PlatformType.Reactnativeandroid,
              ].includes(platform?.type! as PlatformType) && (
                <>
                  <InputField
                    name="key"
                    label="App Key"
                    placeholder={
                      platform?.type!.includes("ios") ? "com.example.app" : "com.example.app"
                    }
                    description="Enter your app bundle identifier/package name"
                  />
                </>
              )}
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
