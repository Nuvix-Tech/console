import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { Form, SubmitButton } from "@/components/others/forms";
import { PermissionField } from "@/components/others/permissions";
import { getCollectionPageState, getDbPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  permissions: y.array(),
});

export const UpdatePermissions: React.FC = () => {
  const { database } = getDbPageState();
  const { collection, _update } = getCollectionPageState();
  const { sdk } = getProjectState();
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
            );
            addToast({
              variant: "success",
              message: "Collection name updated.",
            });
            await _update();
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
            </CardBoxItem>
            <CardBoxItem>
              <PermissionField name="permissions" withCreate />
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
