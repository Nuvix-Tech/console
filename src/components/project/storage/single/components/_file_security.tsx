import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, InputSwitchField, SubmitButton } from "@/components/others/forms";
import { useBucketStore, useProjectStore } from "@/lib/store";
import { useToast } from "@/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  fileSecurity: y.boolean().required(),
});

export const FileSecurity: React.FC = () => {
  const sdk = useProjectStore.use.sdk?.();
  const refresh = useBucketStore.use.refresh();
  const bucket = useBucketStore.use.bucket?.();

  const { addToast } = useToast();

  if (!bucket || !sdk) return null;

  return (
    <>
      <Form
        initialValues={{
          fileSecurity: bucket.fileSecurity,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk.storage.updateBucket(bucket.$id, bucket.name, undefined, values.fileSecurity);
            addToast({
              variant: "success",
              message: "File security updated successfully",
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
              <CardBoxTitle>File Security</CardBoxTitle>
            </CardBoxItem>
            <CardBoxItem>
              <InputSwitchField name="fileSecurity" label="File Security" reverse />
              <CardBoxDesc>
                When file security is enabled, users will be able to access files for which they
                have been granted either File or Bucket permissions.
                <br />
                If file security is disabled, users can access files only if they have Bucket
                permissions. File permissions will be ignored.
              </CardBoxDesc>
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
