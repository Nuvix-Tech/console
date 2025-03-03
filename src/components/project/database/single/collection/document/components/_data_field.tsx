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
import {
  Text,
  Hash,
  CheckCircle,
  List,
  Link,
  AtSign,
  Users,
  Calendar,
  Globe,
  Brackets,
} from "lucide-react";
import { FIELD_TYPES } from "./_fields";

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
}): (typeof FIELD_TYPES)[number] => {
  return (attribute.format || attribute.type) as (typeof FIELD_TYPES)[number];
};

export const UpdateField: React.FC<Props> = ({ name, value, schema, children, attribute }) => {
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
              <div className="flex items-center gap-2">
                {TypeIcon(getFieldType(attribute), attribute.array)}
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

const TypeIcon = (type: (typeof FIELD_TYPES)[number], isArray: boolean) => {
  const icons = {
    string: <Text size={16} />,
    integer: <Hash size={16} />,
    boolean: <CheckCircle size={16} />,
    enum: <List size={16} />,
    url: <Link size={16} />,
    email: <AtSign size={16} />,
    relationship: <Users size={16} />,
    datetime: <Calendar size={16} />,
    ip: <Globe size={16} />,
  };

  return (
    <div className="flex items-center gap-2 size-8 bg-muted rounded-full relative justify-center">
      {icons[type]}
      {isArray && (
        <div className="absolute bottom-0 right-0">
          <Brackets size={10} />
        </div>
      )}
    </div>
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
