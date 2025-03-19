import {
  FormDialog,
  InputField,
  InputNumberField,
  InputSwitchField,
  InputTagField,
  SubmitButton,
} from "@/components/others/forms";
import { useCollectionStore, useDatabaseStore, useProjectStore } from "@/lib/store";
import { Column, Row, useToast } from "@/ui/components";
import * as y from "yup";
import { AttributeIcon } from "./_attribute_icon";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { SelectBooleanField, SelectField } from "../document/components";

interface BaseProps {
  onClose: () => void;
  isOpen: boolean;
  refetch: () => Promise<void>;
}

const DefaultValueField = ({ type }: { type: string }) => {
  const { values, setFieldValue, handleBlur } = useFormikContext<{
    required: boolean;
    array: boolean;
    default: string | number | boolean;
    elements: string[];
  }>();

  const commonProps = {
    name: "default",
    label: "Default Value",
    disabled: values.required || values.array,
    nullable: true,
  };

  switch (type) {
    case "string":
      return <InputField {...commonProps} />;
    case "integer":
    case "float":
      return <InputNumberField {...commonProps} />;
    case "boolean":
      return (
        <SelectBooleanField
          {...commonProps}
          value={values.default}
          onChange={(e: any) => setFieldValue("default", e.target.value)}
          onBlur={handleBlur}
          options={[
            { value: "null", label: "NULL" },
            { value: true, label: "True" },
            { value: false, label: "False" },
          ]}
        />
      );
    case "enum":
      return (
        <SelectField
          {...commonProps}
          value={values.default}
          onChange={(e: any) => setFieldValue("default", e.target.value)}
          onBlur={handleBlur}
          options={[
            { value: "null", label: "NULL" },
            ...values.elements?.map((element: string) => ({
              value: element,
              label: element,
            })),
          ]}
        />
      );
    case "datetime":
      return <InputField {...commonProps} type="datetime-local" />;
    case "ip":
      return <InputField {...commonProps} placeholder="192.168.1.1" />;
    case "url":
      return <InputField {...commonProps} placeholder="https://example.com" />;
    case "email":
      return <InputField {...commonProps} placeholder="user@example.com" type="email" />;
    default:
      return <InputField {...commonProps} />;
  }
};

const RequiredField = () => {
  const { values, setFieldValue } = useFormikContext<{ array: boolean; required: boolean }>();

  useEffect(() => {
    if (values.required) {
      setFieldValue("array", false);
      setFieldValue("default", null);
    }
  }, [values]);

  return (
    <InputSwitchField
      className="gap-0"
      name="required"
      label="Required"
      description="Is this field required?"
      reverse
      disabled={values.array}
    />
  );
};

const ArrayField = () => {
  const { values, setFieldValue } = useFormikContext<{ required: boolean; array: boolean }>();

  useEffect(() => {
    if (values.array) {
      setFieldValue("required", false);
      setFieldValue("default", null);
    }
  }, [values]);

  return (
    <InputSwitchField
      className="gap-0"
      name="array"
      label="Is Array"
      description="Allows storing multiple values of this type"
      reverse
      disabled={values.required}
    />
  );
};

const AttributeFormBase = ({
  onClose,
  isOpen,
  refetch,
  title,
  format,
  description,
  initialValues,
  validationSchema,
  formFields,
  submitAction,
}: BaseProps & {
  title: string;
  format: string;
  description: string;
  initialValues: any;
  validationSchema: any;
  formFields: React.ReactNode;
  submitAction: (values: any) => Promise<void>;
}) => {
  const { addToast } = useToast();

  return (
    <FormDialog
      dialog={{
        title: (
          <Row gap="8">
            {AttributeIcon({ format })} {title}
          </Row>
        ),
        description: description,
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema,
        initialValues,
        onSubmit: async (values) => {
          try {
            await submitAction(values);
            addToast({
              message: "Attribute created successfully",
              variant: "success",
            });
            onClose();
            await refetch();
          } catch (error: any) {
            addToast({
              message: error.message,
              variant: "danger",
            });
          }
        },
      }}
    >
      <Column paddingY="12" fillWidth gap="16">
        {formFields}
      </Column>
    </FormDialog>
  );
};

const keyValidation = y
  .string()
  .required()
  .matches(
    /^[a-zA-Z0-9][a-zA-Z0-9\-_.]*$/,
    "Key must contain only alphanumeric, hyphen, non-leading underscore, period",
  );

const keyField = (
  <InputField
    name="key"
    label="Key"
    required
    description="Key must contain only alphanumeric, hyphen, non-leading underscore, period"
  />
);

const commonFormFields = (type: string) => (
  <>
    <DefaultValueField type={type} />
    <RequiredField />
    <ArrayField />
  </>
);

export const StringAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const schema = y.object({
    key: keyValidation,
    size: y.number().positive().integer().required(),
    default: y
      .string()
      .nullable()
      .when(["required", "array"], {
        is: (required: boolean, array: boolean) => required || array,
        then: (schema) => schema.transform(() => null),
      }),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  const formFields = (
    <>
      {keyField}
      <InputNumberField name="size" label="Size" required />
      {commonFormFields("string")}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="String"
      format="string"
      description="Create a new string attribute for this collection"
      initialValues={{
        key: "",
        size: null,
        default: null,
        required: false,
        array: false,
      }}
      validationSchema={schema}
      formFields={formFields}
      submitAction={async (values) => {
        const { key, size, default: defaultValue, required, array } = values;
        await sdk.databases.createStringAttribute(
          database!.$id,
          collection!.$id,
          key,
          size,
          required,
          defaultValue,
          array,
        );
      }}
    />
  );
};

export const IntegerAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const schema = y.object({
    key: keyValidation,
    default: y.number().integer().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
    min: y.number().integer().nullable(),
    max: y.number().integer().nullable(),
  });

  const formFields = (
    <>
      {keyField}
      <Row gap="8">
        <InputNumberField name="min" label="Minimum" nullable />
        <InputNumberField name="max" label="Maximum" nullable />
      </Row>
      {commonFormFields("integer")}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Integer"
      format="integer"
      description="Create a new integer attribute for this collection"
      initialValues={{
        key: "",
        default: null,
        required: false,
        array: false,
        min: null,
        max: null,
      }}
      validationSchema={schema}
      formFields={formFields}
      submitAction={async (values) => {
        const { key, default: defaultValue, required, array, min, max } = values;
        await sdk.databases.createIntegerAttribute(
          database!.$id,
          collection!.$id,
          key,
          required,
          min,
          max,
          defaultValue,
          array,
        );
      }}
    />
  );
};

export const FloatAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const schema = y.object({
    key: keyValidation,
    default: y.number().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
    min: y.number().nullable(),
    max: y.number().nullable(),
  });

  const formFields = (
    <>
      {keyField}
      <Row gap="8">
        <InputNumberField name="min" label="Minimum" nullable />
        <InputNumberField name="max" label="Maximum" nullable />
      </Row>
      {commonFormFields("float")}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Float"
      format="float"
      description="Create a new float attribute for this collection"
      initialValues={{
        key: "",
        default: null,
        required: false,
        array: false,
        min: null,
        max: null,
      }}
      validationSchema={schema}
      formFields={formFields}
      submitAction={async (values) => {
        const { key, default: defaultValue, required, array, min, max } = values;
        await sdk.databases.createFloatAttribute(
          database!.$id,
          collection!.$id,
          key,
          required,
          min,
          max,
          defaultValue,
          array,
        );
      }}
    />
  );
};

export const BooleanAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const schema = y.object({
    key: keyValidation,
    default: y.boolean().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  const formFields = (
    <>
      {keyField}
      {commonFormFields("boolean")}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Boolean"
      format="boolean"
      description="Create a new boolean attribute for this collection"
      initialValues={{
        key: "",
        default: null,
        required: false,
        array: false,
      }}
      validationSchema={schema}
      formFields={formFields}
      submitAction={async (values) => {
        const { key, default: defaultValue, required, array } = values;
        await sdk.databases.createBooleanAttribute(
          database!.$id,
          collection!.$id,
          key,
          required,
          defaultValue,
          array,
        );
      }}
    />
  );
};

export const DatetimeAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const schema = y.object({
    key: keyValidation,
    default: y.string().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  const formFields = (
    <>
      {keyField}
      {commonFormFields("datetime")}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Datetime"
      format="datetime"
      description="Create a new datetime attribute for this collection"
      initialValues={{
        key: "",
        default: null,
        required: false,
        array: false,
      }}
      validationSchema={schema}
      formFields={formFields}
      submitAction={async (values) => {
        const { key, default: defaultValue, required, array } = values;
        await sdk.databases.createDatetimeAttribute(
          database!.$id,
          collection!.$id,
          key,
          required,
          defaultValue,
          array,
        );
      }}
    />
  );
};

export const IpAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const schema = y.object({
    key: keyValidation,
    default: y.string().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  const formFields = (
    <>
      {keyField}
      {commonFormFields("ip")}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="IP Attribute"
      format="ip"
      description="Create a new IP address attribute for this collection"
      initialValues={{
        key: "",
        default: null,
        required: false,
        array: false,
      }}
      validationSchema={schema}
      formFields={formFields}
      submitAction={async (values) => {
        const { key, default: defaultValue, required, array } = values;
        await sdk.databases.createIpAttribute(
          database!.$id,
          collection!.$id,
          key,
          required,
          defaultValue,
          array,
        );
      }}
    />
  );
};

export const UrlAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const schema = y.object({
    key: keyValidation,
    default: y.string().url().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  const formFields = (
    <>
      {keyField}
      {commonFormFields("url")}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="URL"
      format="url"
      description="Create a new URL attribute for this collection"
      initialValues={{
        key: "",
        default: null,
        required: false,
        array: false,
      }}
      validationSchema={schema}
      formFields={formFields}
      submitAction={async (values) => {
        const formFields = (
          <>
            {keyField}
            {commonFormFields("url")}
          </>
        );
        const { key, default: defaultValue, required, array } = values;
        await sdk.databases.createUrlAttribute(
          database!.$id,
          collection!.$id,
          key,
          required,
          defaultValue,
          array,
        );
      }}
    />
  );
};

export const EmailAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const schema = y.object({
    key: keyValidation,
    default: y.string().email().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  const formFields = (
    <>
      {keyField}
      {commonFormFields("email")}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Email"
      format="email"
      description="Create a new email attribute for this collection"
      initialValues={{
        key: "",
        default: null,
        required: false,
        array: false,
      }}
      validationSchema={schema}
      formFields={formFields}
      submitAction={async (values) => {
        const { key, default: defaultValue, required, array } = values;
        await sdk.databases.createEmailAttribute(
          database!.$id,
          collection!.$id,
          key,
          required,
          defaultValue,
          array,
        );
      }}
    />
  );
};

export const EnumAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const schema = y.object({
    key: keyValidation,
    elements: y.array().of(y.string()).min(1).required(),
    default: y.string().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  const formFields = (
    <>
      {keyField}
      <InputTagField name="elements" label="Elements" />
      {commonFormFields("enum")}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Enum"
      format="enum"
      description="Create a new enum attribute for this collection"
      initialValues={{
        key: "",
        elements: [],
        default: null,
        required: false,
        array: false,
      }}
      validationSchema={schema}
      formFields={formFields}
      submitAction={async (values) => {
        const { key, elements, default: defaultValue, required, array } = values;
        await sdk.databases.createEnumAttribute(
          database!.$id,
          collection!.$id,
          key,
          elements,
          required,
          defaultValue,
          array,
        );
      }}
    />
  );
};

export const RelationshipAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();
  // TODO:--
  const schema = y.object({
    key: keyValidation,
    relatedCollection: y.string().required(),
    relationType: y.string().oneOf(["oneToOne", "oneToMany", "manyToOne", "manyToMany"]).required(),
    twoWay: y.boolean().default(false),
    twoWayKey: y.string().when("twoWay", (twoWay, schema) => {
      return twoWay ? schema.required("Two-way key is required when two-way is enabled") : schema;
    }),
    onDelete: y.string().oneOf(["cascade", "restrict", "setNull"]).default("setNull"),
  });

  const formFields = (
    <>
      <InputField
        name="key"
        label="Key"
        required
        description="Key must contain only alphanumeric, hyphen, non-leading underscore, period"
      />
      <InputField name="relatedCollection" label="Related Collection" required />
      <InputField name="relationType" label="Relation Type" type="select" required />
      <InputSwitchField name="twoWay" label="Two-Way Relationship" reverse className="gap-0" />
      <InputField name="twoWayKey" label="Two-Way Key" />
      <InputField name="onDelete" label="On Delete Action" type="select" required />
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Relationship"
      format="relationship"
      description="Create a new relationship attribute for this collection"
      initialValues={{
        key: "",
        relatedCollection: "",
        relationType: "oneToOne",
        twoWay: false,
        twoWayKey: "",
        onDelete: "setNull",
      }}
      validationSchema={schema}
      formFields={formFields}
      submitAction={async (values) => {
        const { key, relatedCollection, relationType, twoWay, twoWayKey, onDelete } = values;
        await sdk.databases.createRelationshipAttribute(
          database!.$id,
          collection!.$id,
          key,
          relatedCollection,
          relationType,
          twoWay,
          twoWayKey,
          onDelete, //TODO:--
        );
      }}
    />
  );
};
