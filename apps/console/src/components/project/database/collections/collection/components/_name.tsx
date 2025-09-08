import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { useProjectStore } from "@/lib/store";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { useToast } from "@nuvix/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  name: y.string().min(0).max(256).required(),
});

export const UpdateName: React.FC = () => {
  const sdk = useProjectStore.use.sdk?.();
  const state = useCollectionEditorCollectionStateSnapshot();
  const collection = state.collection;

  const { addToast } = useToast();

  if (!collection || !sdk) return;

  return (
    <>
      <Form
        initialValues={{
          name: collection.name,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk.databases.updateCollection(
              collection.$schema,
              collection.$id,
              values.name,
              collection.$permissions,
              collection.documentSecurity,
              collection.enabled,
            );
            addToast({
              variant: "success",
              message: "Collection name updated.",
            });
            // await refresh();
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
