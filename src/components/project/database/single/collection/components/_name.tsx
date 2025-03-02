import { CardBox, CardBoxBody, CardBoxItem, CardBoxTitle } from "@/components/others/card";
import { Form, InputField, SubmitButton } from "@/components/others/forms";
import { getCollectionPageState, getDbPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";
import { ColorPickerValueSwatch } from "@chakra-ui/react";
import React from "react";
import * as y from "yup";

const schema = y.object({
  name: y.string().min(0).max(256).required(),
});

export const UpdateName: React.FC = () => {
  const { database } = getDbPageState();
  const { collection, _update } = getCollectionPageState();
  const { sdk } = getProjectState();
  const { addToast } = useToast();

  if (!database || !collection || !sdk) return;

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
              database.$id,
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
