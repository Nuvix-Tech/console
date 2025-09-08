import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { useCollectionUpdateMutation } from "@/data/collections/collection-update-mutation";
import { useProjectStore } from "@/lib/store";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { useToast } from "@nuvix/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  name: y.string().min(0).max(256).required(),
});

export const UpdateName: React.FC = () => {
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
          name: collection.name,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          return await mutateAsync({
            projectRef: project.$id,
            sdk,
            collection,
            schema: collection.$schema,
            payload: { name: values.name },
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
