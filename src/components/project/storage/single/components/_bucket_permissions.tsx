import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, SubmitButton } from "@/components/others/forms";
import { PermissionField } from "@/components/others/permissions";
import { useBucketStore, useProjectStore } from "@/lib/store";
import { useToast } from "@/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  permissions: y.array(),
});

export const UpdateBucketPermissions: React.FC = () => {
  const sdk = useProjectStore.use.sdk?.();
  const refresh = useBucketStore.use.refresh();
  const bucket = useBucketStore.use.bucket?.();

  const { addToast } = useToast();

  if (!bucket || !sdk) return;

  return (
    <>
      <Form
        initialValues={{
          permissions: bucket.$permissions,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk.storage.updateBucket(bucket.$id, bucket.name, values.permissions);
            addToast({
              variant: "success",
              message: "Bucket updated successfully",
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
              <CardBoxTitle>Permissions</CardBoxTitle>
              <CardBoxDesc>
                Manage the permissions for this bucket. You can add or remove permissions as needed.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <PermissionField name="permissions" withCreate sdk={sdk} />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
