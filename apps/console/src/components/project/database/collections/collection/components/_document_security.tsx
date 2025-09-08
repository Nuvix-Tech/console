import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, InputSwitchField, SubmitButton } from "@/components/others/forms";
import { useCollectionUpdateMutation } from "@/data/collections/collection-update-mutation";
import { useProjectStore } from "@/lib/store";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { useToast } from "@nuvix/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  is: y.boolean().required(),
});

export const DocumentSecurity: React.FC = () => {
  const { project, sdk } = useProjectStore((s) => s);
  const state = useCollectionEditorCollectionStateSnapshot();
  const collection = state.collection;
  const { addToast } = useToast();
  const { mutateAsync } = useCollectionUpdateMutation({
    onSuccess: () => {
      addToast({
        variant: "success",
        message: "Collection updated.",
      });
    },
    onError: (error) => {
      addToast({
        variant: "danger",
        message: `Failed to update collection: ${error.message}`,
      });
    },
  });

  if (!collection || !sdk) return;

  return (
    <>
      <Form
        initialValues={{
          is: collection?.documentSecurity,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          return mutateAsync({
            projectRef: project.$id,
            sdk,
            collection,
            schema: collection.$schema,
            payload: { documentSecurity: values.is },
          });
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
