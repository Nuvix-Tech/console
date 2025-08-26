import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, SubmitButton } from "@/components/others/forms";
import { PermissionField } from "@/components/others/permissions";
import { useCollectionStore, useDatabaseStore, useProjectStore } from "@/lib/store";
import { useToast } from "@nuvix/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  permissions: y.array(),
});

export const UpdatePermissions: React.FC = () => {
  const sdk = useProjectStore.use.sdk?.();
  const refresh = useCollectionStore.use.refresh();
  const collection = useCollectionStore.use.collection?.();
  const database = useDatabaseStore.use.database?.();

  const { addToast } = useToast();

  if (!database || !collection || !sdk) return;

  return (
    <>
      <Form
        initialValues={{
          permissions: collection.$permissions,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk.databases.updateCollection(
              database.$id,
              collection.$id,
              collection.name,
              values.permissions,
              collection.documentSecurity,
              collection.enabled,
            );
            addToast({
              variant: "success",
              message: "Collection permissions updated.",
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
                Select who can access your collection and documents. Learn more about Permissions.
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
