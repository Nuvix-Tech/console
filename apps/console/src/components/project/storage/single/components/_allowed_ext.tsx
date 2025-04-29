import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, InputTagField, SubmitButton } from "@/components/others/forms";
import { useBucketStore, useProjectStore } from "@/lib/store";
import { useToast } from "@nuvix/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  allowedExtensions: y.array(),
});

export const UpdateAllowedExt: React.FC = () => {
  const sdk = useProjectStore.use.sdk?.();
  const refresh = useBucketStore.use.refresh();
  const bucket = useBucketStore.use.bucket?.();

  const { addToast } = useToast();

  if (!bucket || !sdk) return;

  return (
    <>
      <Form
        initialValues={{
          allowedExtensions: bucket.allowedFileExtensions ?? [],
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
              undefined,
              undefined,
              values.allowedExtensions,
            );
            addToast({
              variant: "success",
              message: "Allowed extensions updated successfully",
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
              <CardBoxTitle>Allowed Extensions</CardBoxTitle>
              <CardBoxDesc>
                Manage the allowed file extensions for this bucket. You can add or remove extensions
                as needed.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              <InputTagField
                name="allowedExtensions"
                label="Allowed Extensions"
                removeOnSelect
                suggestion={[
                  "pdf",
                  "jpg",
                  "jpeg",
                  "png",
                  "gif",
                  "doc",
                  "docx",
                  "xls",
                  "xlsx",
                  "ppt",
                  "pptx",
                  "txt",
                  "csv",
                  "zip",
                  "rar",
                  "mp3",
                  "mp4",
                  "mov",
                  "svg",
                ]}
              />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
