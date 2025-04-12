import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, InputSwitchField, SubmitButton } from "@/components/others/forms";
import { useBucketStore, useProjectStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  is: y.boolean().required(),
});

export const MetaEnable: React.FC = () => {
  const sdk = useProjectStore.use.sdk?.();
  const refresh = useBucketStore.use.refresh();
  const bucket = useBucketStore.use.bucket?.();

  const { addToast } = useToast();

  if (!bucket || !sdk) return;

  return (
    <>
      <Form
        initialValues={{
          is: bucket.enabled,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk.storage.updateBucket(
              bucket.$id,
              bucket.name,
              undefined,
              undefined,
              values.is,
            );
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
              <CardBoxTitle>{bucket.name}</CardBoxTitle>
            </CardBoxItem>
            <CardBoxItem>
              <InputSwitchField name="is" label="Enable / Disable" reverse />
              <CardBoxDesc>Created: {formatDate(bucket.$createdAt)}</CardBoxDesc>
              <CardBoxDesc>Last updated: {formatDate(bucket.$updatedAt)}</CardBoxDesc>
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
