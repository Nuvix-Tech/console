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
import { formatDate } from "@/lib/utils";
import { useToast } from "@nuvix/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  is: y.boolean().required(),
});

export const MetaEnable: React.FC = () => {
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
          is: collection.enabled,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          return await mutateAsync({
            projectRef: project.$id,
            sdk,
            collection,
            schema: collection.$schema,
            payload: {
              enabled: values.is,
            },
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
              <CardBoxTitle>{collection.name}</CardBoxTitle>
            </CardBoxItem>
            <CardBoxItem>
              <InputSwitchField name="is" label="Enable / Disable" reverse />
              <CardBoxDesc>Created: {formatDate(collection.$createdAt)}</CardBoxDesc>
              <CardBoxDesc>Last updated: {formatDate(collection.$updatedAt)}</CardBoxDesc>
            </CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
