import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { Form, SubmitButton } from "@/components/others/forms";
import { useToast } from "@nuvix/ui/components";
import React from "react";
import { AttributeIcon } from "../../components";
import {
  useCollectionStore,
  useDatabaseStore,
  useDocumentStore,
  useProjectStore,
} from "@/lib/store";
import { AttributeFormat, Attributes } from "./_utils";

interface Props {
  name: string;
  value: any;
  children: React.ReactNode;
  attribute: any;
  schema?: any;
}

export const getFieldType = (attribute: {
  type: string;
  format?: string;
}): Attributes | AttributeFormat => {
  return (attribute.format || attribute.type) as Attributes | AttributeFormat;
};

export const UpdateField: React.FC<Props> = ({ name, value, schema, children, attribute }) => {
  const document = useDocumentStore.use.document?.();
  const refresh = useDocumentStore.use.refresh();
  const sdk = useProjectStore.use.sdk?.();
  const collection = useCollectionStore.use.collection?.();
  const database = useDatabaseStore.use.database?.();

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
              <div className="flex items-center gap-2">
                {AttributeIcon(attribute, attribute.array)}
                <CardBoxTitle>{name}</CardBoxTitle>
              </div>
              <CardBoxDesc>{getFieldDescription(name, attribute)}</CardBoxDesc>
            </CardBoxItem>
            <CardBoxItem>{children}</CardBoxItem>
          </CardBoxBody>
        </CardBox>
      </Form>
    </>
  );
};

export const getFieldDescription = (
  name: string,
  field: {
    type: string;
    format?: string;
    array?: boolean;
    required?: boolean;
    min?: number;
    max?: number;
    size?: number;
    default?: any;
  },
) => {
  let description = `${name} is ${field.array ? "a list of " : "a "}${field.format || field.type} value.`;

  if (field.required) description += " This field is required.";

  if (field.type === "string") {
    if (field.min !== undefined) description += ` Minimum length: ${field.min} characters.`;
    if (field.max !== undefined) description += ` Maximum length: ${field.max} characters.`;
  } else {
    if (field.min !== undefined) description += ` Minimum value: ${field.min}.`;
    if (field.max !== undefined) description += ` Maximum value: ${field.max}.`;
  }

  if (field.size !== undefined) description += ` Maximum size: ${field.size} bytes.`;
  if (field.default !== undefined) description += ` Default value: ${field.default}.`;

  return description;
};
