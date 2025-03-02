import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, InputSwitchField, SubmitButton } from "@/components/others/forms";
import { getCollectionPageState, getDbPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  is: y.boolean().required(),
});

export const DocumentSecurity: React.FC = () => {
  const { database } = getDbPageState();
  const { collection, _update } = getCollectionPageState();
  const { sdk } = getProjectState();
  const { addToast } = useToast();

  if (!database || !collection || !sdk) return;

  return (
    <>
      <Form
        initialValues={{
          is: collection?.documentSecurity,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk.databases.updateCollection(
              database.$id,
              collection.$id,
              collection.name,
              collection.$permissions,
              values.is,
              collection.enabled,
            );
            addToast({
              variant: "success",
              message: "Document security updated.",
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
              <CardBoxTitle>Document Security</CardBoxTitle>
            </CardBoxItem>
            <CardBoxItem>
              <InputSwitchField name="is" label="Document security" />
              <CardBoxDesc>
                When document security is enabled, users can access documents if they have either
                document-specific permissions or collection-level permissions.
              </CardBoxDesc>
              <CardBoxDesc>
                If document security is disabled, access is granted only through collection
                permissions, and document-specific permissions are ignored.
              </CardBoxDesc>
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
