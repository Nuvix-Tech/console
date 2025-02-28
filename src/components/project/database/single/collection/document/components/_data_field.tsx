import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, SubmitButton } from "@/components/others/forms";
import { getCollectionPageState, getDbPageState, getDocumentPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { useToast } from "@/ui/components";
import React from "react";
import * as y from "yup";

interface Props {
  name: string;
  value: any;
  children: React.ReactNode;
  schema?: any;
}

export const UpdateField: React.FC<Props> = ({ name, value, schema, children }) => {
  const { database } = getDbPageState();
  const { collection } = getCollectionPageState();
  const { document, _update } = getDocumentPageState();
  const { sdk } = getProjectState();
  const { addToast } = useToast();

  if (!sdk || !database || !collection || !document) return;

  return (
    <>
      <Form
        initialValues={{
          [name]: value,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await sdk.databases.updateDocument(
              database.$id,
              collection.$id,
              document.$id,
              values,
              document.$permissions,
            );
            addToast({
              variant: "success",
              message: "Document data updated.",
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
              <CardBoxTitle>{name}</CardBoxTitle>
              <CardBoxDesc></CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>{children}</CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};
