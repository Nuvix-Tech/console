import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, SubmitButton } from "@/components/others/forms";
import { PermissionField } from "@/components/others/permissions";
import { getCollectionPageState, getDbPageState, getDocumentPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { Feedback, useToast } from "@/ui/components";
import { Info } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import React from "react";
import * as y from "yup";

const schema = y.object({
  permissions: y.array(),
});

export const UpdatePermissions: React.FC = () => {
  const { database } = getDbPageState();
  const { collection } = getCollectionPageState();
  const { document, _update } = getDocumentPageState();
  const { sdk } = getProjectState();
  const { addToast } = useToast();

  if (!database || !collection || !document || !sdk) return;

  return (
    <>
      <Form
        initialValues={{
          permissions: document.$permissions,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk.databases.updateDocument(
              database.$id,
              collection.$id,
              document.$id,
              undefined,
              values.permissions,
            );
            addToast({
              variant: "success",
              message: "Document permissions updated.",
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
              <CardBoxDesc>
                A user requires appropriate permissions at either the collection level or document
                level to access a document. If no permissions are configured, no user can access the
                document. Learn more about database permissions.
              </CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>
              {collection.documentSecurity ? (
                <PermissionField name="permissions" withCreate sdk={sdk} />
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Document Security Disabled</AlertTitle>
                  <AlertDescription>
                    To assign document-specific permissions, enable document security in the collection settings. Otherwise, only collection-level permissions will apply.      </AlertDescription>
                </Alert>
              )}
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
