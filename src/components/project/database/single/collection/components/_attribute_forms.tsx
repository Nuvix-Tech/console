import { CustomID } from "@/components/_custom_id";
import { FormDialog, InputField, SubmitButton } from "@/components/others/forms";
import { useCollectionStore, useDatabaseStore, useProjectStore } from "@/lib/store";
import { Column, Row, useToast } from "@/ui/components";
import * as y from "yup";
import { AttributeIcon } from "./_attribute_icon";

interface BaseProps {
  onClose: () => void;
  isOpen: boolean;
  refetch: () => Promise<void>;
}

export const StringAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const { addToast } = useToast();

  const schema = y.object({
    key: y
      .string()
      .required()
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9\-_.]*$/,
        "Key must contain only alphanumeric, hyphen, non-leading underscore, period",
      ),
    size: y.number().positive().integer().required(),
    default: y.string().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  return (
    <FormDialog
      dialog={{
        title: <Row gap="8">{AttributeIcon({ format: "string" })} Create String Attribute</Row>,
        description: "Create a new string attribute for this collection",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          key: "",
          size: 0,
          default: "",
          required: false,
          array: false,
        },
        onSubmit: async (values) => {
          try {
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
      <Column paddingY="12" fillWidth gap="8">
        <InputField name="name" label="Name" />
        <CustomID name="id" label="Database ID" />
      </Column>
    </FormDialog>
  );
};

export const IntegerAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const { addToast } = useToast();

  const schema = y.object({
    key: y
      .string()
      .required()
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9\-_.]*$/,
        "Key must contain only alphanumeric, hyphen, non-leading underscore, period",
      ),
    default: y.number().integer().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
    min: y.number().integer().nullable(),
    max: y.number().integer().nullable(),
  });

  return (
    <FormDialog
      dialog={{
        title: <Row gap="8">{AttributeIcon({ format: "integer" })} Create Integer Attribute</Row>,
        description: "Create a new integer attribute for this collection",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          key: "",
          default: null,
          required: false,
          array: false,
          min: null,
          max: null,
        },
        onSubmit: async (values) => {
          try {
            const { key, default: defaultValue, required, array, min, max } = values;
            await sdk.databases.createIntegerAttribute(
              database!.$id,
              collection!.$id,
              key,
              required,
              defaultValue,
              array,
              min,
              max,
            );
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
      <Column paddingY="12" fillWidth gap="8">
        <InputField name="key" label="Key" />
        <InputField name="default" label="Default Value" type="number" />
        <InputField name="min" label="Minimum Value" type="number" />
        <InputField name="max" label="Maximum Value" type="number" />
        <InputField name="required" label="Required" type="checkbox" />
        <InputField name="array" label="Is Array" type="checkbox" />
      </Column>
    </FormDialog>
  );
};

export const FloatAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const { addToast } = useToast();

  const schema = y.object({
    key: y
      .string()
      .required()
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9\-_.]*$/,
        "Key must contain only alphanumeric, hyphen, non-leading underscore, period",
      ),
    default: y.number().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
    min: y.number().nullable(),
    max: y.number().nullable(),
  });

  return (
    <FormDialog
      dialog={{
        title: <Row gap="8">{AttributeIcon({ format: "float" })} Create Float Attribute</Row>,
        description: "Create a new float attribute for this collection",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          key: "",
          default: null,
          required: false,
          array: false,
          min: null,
          max: null,
        },
        onSubmit: async (values) => {
          try {
            const { key, default: defaultValue, required, array, min, max } = values;
            await sdk.databases.createFloatAttribute(
              database!.$id,
              collection!.$id,
              key,
              required,
              defaultValue,
              array,
              min,
              max,
            );
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
      <Column paddingY="12" fillWidth gap="8">
        <InputField name="key" label="Key" />
        <InputField name="default" label="Default Value" type="number" step="0.01" />
        <InputField name="min" label="Minimum Value" type="number" step="0.01" />
        <InputField name="max" label="Maximum Value" type="number" step="0.01" />
        <InputField name="required" label="Required" type="checkbox" />
        <InputField name="array" label="Is Array" type="checkbox" />
      </Column>
    </FormDialog>
  );
};

export const BooleanAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const { addToast } = useToast();

  const schema = y.object({
    key: y
      .string()
      .required()
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9\-_.]*$/,
        "Key must contain only alphanumeric, hyphen, non-leading underscore, period",
      ),
    default: y.boolean().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  return (
    <FormDialog
      dialog={{
        title: <Row gap="8">{AttributeIcon({ format: "boolean" })} Create Boolean Attribute</Row>,
        description: "Create a new boolean attribute for this collection",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          key: "",
          default: null,
          required: false,
          array: false,
        },
        onSubmit: async (values) => {
          try {
            const { key, default: defaultValue, required, array } = values;
            await sdk.databases.createBooleanAttribute(
              database!.$id,
              collection!.$id,
              key,
              required,
              defaultValue,
              array,
            );
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
      <Column paddingY="12" fillWidth gap="8">
        <InputField name="key" label="Key" />
        <InputField name="default" label="Default Value" type="checkbox" />
        <InputField name="required" label="Required" type="checkbox" />
        <InputField name="array" label="Is Array" type="checkbox" />
      </Column>
    </FormDialog>
  );
};

export const DatetimeAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const { addToast } = useToast();

  const schema = y.object({
    key: y
      .string()
      .required()
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9\-_.]*$/,
        "Key must contain only alphanumeric, hyphen, non-leading underscore, period",
      ),
    default: y.string().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  return (
    <FormDialog
      dialog={{
        title: <Row gap="8">{AttributeIcon({ format: "datetime" })} Create Datetime Attribute</Row>,
        description: "Create a new datetime attribute for this collection",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          key: "",
          default: null,
          required: false,
          array: false,
        },
        onSubmit: async (values) => {
          try {
            const { key, default: defaultValue, required, array } = values;
            await sdk.databases.createDatetimeAttribute(
              database!.$id,
              collection!.$id,
              key,
              required,
              defaultValue,
              array,
            );
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
      <Column paddingY="12" fillWidth gap="8">
        <InputField name="key" label="Key" />
        <InputField name="default" label="Default Value" type="datetime-local" />
        <InputField name="required" label="Required" type="checkbox" />
        <InputField name="array" label="Is Array" type="checkbox" />
      </Column>
    </FormDialog>
  );
};

export const IpAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const { addToast } = useToast();

  const schema = y.object({
    key: y
      .string()
      .required()
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9\-_.]*$/,
        "Key must contain only alphanumeric, hyphen, non-leading underscore, period",
      ),
    default: y.string().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  return (
    <FormDialog
      dialog={{
        title: <Row gap="8">{AttributeIcon({ format: "ip" })} Create IP Address Attribute</Row>,
        description: "Create a new IP address attribute for this collection",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          key: "",
          default: null,
          required: false,
          array: false,
        },
        onSubmit: async (values) => {
          try {
            const { key, default: defaultValue, required, array } = values;
            await sdk.databases.createIpAttribute(
              database!.$id,
              collection!.$id,
              key,
              required,
              defaultValue,
              array,
            );
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
      <Column paddingY="12" fillWidth gap="8">
        <InputField name="key" label="Key" />
        <InputField name="default" label="Default Value" placeholder="192.168.1.1" />
        <InputField name="required" label="Required" type="checkbox" />
        <InputField name="array" label="Is Array" type="checkbox" />
      </Column>
    </FormDialog>
  );
};

export const EnumAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const { addToast } = useToast();

  const schema = y.object({
    key: y
      .string()
      .required()
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9\-_.]*$/,
        "Key must contain only alphanumeric, hyphen, non-leading underscore, period",
      ),
    elements: y.array().of(y.string()).min(1).required(),
    default: y.string().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  return (
    <FormDialog
      dialog={{
        title: <Row gap="8">{AttributeIcon({ format: "enum" })} Create Enum Attribute</Row>,
        description: "Create a new enum attribute for this collection",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          key: "",
          elements: [""],
          default: null,
          required: false,
          array: false,
        },
        onSubmit: async (values) => {
          try {
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
      <Column paddingY="12" fillWidth gap="8">
        <InputField name="key" label="Key" />
        {/* This would need to be replaced with a component that allows adding multiple enum elements */}
        <InputField name="elements" label="Elements (comma separated)" />
        <InputField name="default" label="Default Value" />
        <InputField name="required" label="Required" type="checkbox" />
        <InputField name="array" label="Is Array" type="checkbox" />
      </Column>
    </FormDialog>
  );
};

export const UrlAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const { addToast } = useToast();

  const schema = y.object({
    key: y
      .string()
      .required()
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9\-_.]*$/,
        "Key must contain only alphanumeric, hyphen, non-leading underscore, period",
      ),
    default: y.string().url().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  return (
    <FormDialog
      dialog={{
        title: <Row gap="8">{AttributeIcon({ format: "url" })} Create URL Attribute</Row>,
        description: "Create a new URL attribute for this collection",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          key: "",
          default: null,
          required: false,
          array: false,
        },
        onSubmit: async (values) => {
          try {
            const { key, default: defaultValue, required, array } = values;
            await sdk.databases.createUrlAttribute(
              database!.$id,
              collection!.$id,
              key,
              required,
              defaultValue,
              array,
            );
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
      <Column paddingY="12" fillWidth gap="8">
        <InputField name="key" label="Key" />
        <InputField name="default" label="Default Value" placeholder="https://example.com" />
        <InputField name="required" label="Required" type="checkbox" />
        <InputField name="array" label="Is Array" type="checkbox" />
      </Column>
    </FormDialog>
  );
};

export const EmailAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const { addToast } = useToast();

  const schema = y.object({
    key: y
      .string()
      .required()
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9\-_.]*$/,
        "Key must contain only alphanumeric, hyphen, non-leading underscore, period",
      ),
    default: y.string().email().nullable(),
    required: y.boolean().default(false),
    array: y.boolean().default(false),
  });

  return (
    <FormDialog
      dialog={{
        title: <Row gap="8">{AttributeIcon({ format: "email" })} Create Email Attribute</Row>,
        description: "Create a new email attribute for this collection",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          key: "",
          default: null,
          required: false,
          array: false,
        },
        onSubmit: async (values) => {
          try {
            const { key, default: defaultValue, required, array } = values;
            await sdk.databases.createEmailAttribute(
              database!.$id,
              collection!.$id,
              key,
              required,
              defaultValue,
              array,
            );
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
      <Column paddingY="12" fillWidth gap="8">
        <InputField name="key" label="Key" />
        <InputField
          name="default"
          label="Default Value"
          placeholder="user@example.com"
          type="email"
        />
        <InputField name="required" label="Required" type="checkbox" />
        <InputField name="array" label="Is Array" type="checkbox" />
      </Column>
    </FormDialog>
  );
};

export const RelationshipAttributeForm = ({ onClose, isOpen, refetch }: BaseProps) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const { addToast } = useToast();

  const schema = y.object({
    key: y
      .string()
      .required()
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9\-_.]*$/,
        "Key must contain only alphanumeric, hyphen, non-leading underscore, period",
      ),
    relatedCollection: y.string().required(),
    relationType: y.string().oneOf(["oneToOne", "oneToMany", "manyToOne", "manyToMany"]).required(),
    twoWay: y.boolean().default(false),
    twoWayKey: y.string().when("twoWay", (twoWay, schema) => {
      return twoWay ? schema.required("Two-way key is required when two-way is enabled") : schema;
    }),
    onDelete: y.string().oneOf(["cascade", "restrict", "setNull"]).default("setNull"),
  });

  return (
    <FormDialog
      dialog={{
        title: (
          <Row gap="8">
            {AttributeIcon({ format: "relationship" })} Create Relationship Attribute
          </Row>
        ),
        description: "Create a new relationship attribute for this collection",
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema: schema,
        initialValues: {
          key: "",
          relatedCollection: "",
          relationType: "oneToOne",
          twoWay: false,
          twoWayKey: "",
          onDelete: "setNull",
        },
        onSubmit: async (values) => {
          try {
            const { key, relatedCollection, relationType, twoWay, twoWayKey, onDelete } = values;
            await sdk.databases.createRelationshipAttribute(
              database!.$id,
              collection!.$id,
              key,
              relatedCollection,
              relationType,
              twoWay,
              twoWayKey,
              onDelete,
            );
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
      <Column paddingY="12" fillWidth gap="8">
        <InputField name="key" label="Key" />
        <InputField name="relatedCollection" label="Related Collection" />
        <InputField
          name="relationType"
          label="Relation Type"
          type="select"
          // options={[
          //   { label: "One to One", value: "oneToOne" },
          //   { label: "One to Many", value: "oneToMany" },
          //   { label: "Many to One", value: "manyToOne" },
          //   { label: "Many to Many", value: "manyToMany" },
          // ]}
        />
        <InputField name="twoWay" label="Two-Way Relationship" type="checkbox" />
        <InputField name="twoWayKey" label="Two-Way Key" />
        <InputField
          name="onDelete"
          label="On Delete Action"
          type="select"
          // options={[
          //   { label: "Cascade", value: "cascade" },
          //   { label: "Restrict", value: "restrict" },
          //   { label: "Set Null", value: "setNull" },
          // ]}
        />
      </Column>
    </FormDialog>
  );
};
