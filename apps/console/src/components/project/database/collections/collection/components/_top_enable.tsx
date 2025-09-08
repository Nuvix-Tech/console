import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, InputSwitchField, SubmitButton } from "@/components/others/forms";
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
  const sdk = useProjectStore.use.sdk?.();
  const state = useCollectionEditorCollectionStateSnapshot();
  const collection = state.collection;

  const { addToast } = useToast();

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
          try {
            await sdk.databases.updateCollection(
              collection.$schema,
              collection.$id,
              collection.name,
              undefined,
              undefined,
              values.is,
            );
            addToast({
              variant: "success",
              message: "Collection status updated.",
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
