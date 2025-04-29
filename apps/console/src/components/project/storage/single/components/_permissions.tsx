import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, SubmitButton } from "@/components/others/forms";
import { PermissionField } from "@/components/others/permissions";
import { useToast } from "@/ui/components";
import { Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@nuvix/sui/components/alert";
import React from "react";
import * as y from "yup";
import { useBucketStore, useFileStore, useProjectStore } from "@/lib/store";

const schema = y.object({
  permissions: y.array(),
});

export const UpdatePermissions: React.FC = () => {
  const refresh = useFileStore.use.refresh();
  const sdk = useProjectStore.use.sdk?.();
  const bucket = useBucketStore.use.bucket?.();
  const file = useFileStore.use.file?.();
  const { addToast } = useToast();

  if (!bucket || !file || !sdk) return;

  return (
    <>
      <Form
        initialValues={{
          permissions: file.$permissions,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk.storage.updateFile(bucket.$id, file.$id, undefined, values.permissions);
            addToast({
              variant: "success",
              message: "File permissions updated.",
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
                Assign permissions to this file. You can set specific permissions for this file or
                use the bucket-level permissions.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              {bucket.fileSecurity ? (
                <PermissionField name="permissions" sdk={sdk} />
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>File Security Disabled</AlertTitle>
                  <AlertDescription>
                    To assign file-specific permissions, enable file security in the bucket
                    settings. Otherwise, only bucket-level permissions will apply.{" "}
                  </AlertDescription>
                </Alert>
              )}
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
