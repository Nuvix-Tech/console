import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, InputSwitchField, SubmitButton } from "@/components/others/forms";
import { useCollectionStore, useDatabaseStore, useProjectStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/ui/components";
import React from "react";
import * as y from "yup";

const schema = y.object({
  is: y.boolean().required(),
});

export const MetaEnable: React.FC = () => {
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
          is: collection.enabled,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk.databases.updateCollection(
              database.$id,
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
