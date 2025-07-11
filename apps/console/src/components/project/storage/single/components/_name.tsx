import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { useBucketStore, useProjectStore } from "@/lib/store";
import { useToast } from "@nuvix/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  name: y.string().min(0).max(256).required(),
});

export const UpdateName: React.FC = () => {
  const sdk = useProjectStore.use.sdk?.();
  const refresh = useBucketStore.use.refresh();
  const bucket = useBucketStore.use.bucket?.();

  const { addToast } = useToast();

  if (!bucket || !sdk) return;

  return (
    <>
      <Form
        initialValues={{
          name: bucket.name,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk.storage.updateBucket(bucket.$id, values.name, undefined, bucket.enabled);
            addToast({
              variant: "success",
              message: "Bucket name updated.",
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
              <InputField name="name" label="Name" />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
