import {
  FormDialog,
  InputField,
  InputNumberField,
  InputSwitchField,
  InputTagField,
  SubmitButton,
} from "@/components/others/forms";
import { useCollectionStore, useDatabaseStore, useProjectStore } from "@/lib/store";
import { Column, Row, useToast } from "@nuvix/ui/components";
import * as y from "yup";
import { AttributeIcon, RelationshipIcon } from "./_attribute_icon";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { DynamicField, SelectField } from "../document/components";
import { useQuery } from "@tanstack/react-query";
import { RadioCardItem, RadioCardRoot } from "@nuvix/cui/radio-card";
import { MoveHorizontal, MoveRight } from "lucide-react";
import { AttributeFormat, Attributes } from "../document/components/_utils";

interface BaseProps {
  onClose: () => void;
  isOpen: boolean;
  refetch: () => Promise<void>;
}

const DefaultValueField = ({ type }: { type: Attributes | AttributeFormat }) => {
  const { values } = useFormikContext<{
    required: boolean;
    array: boolean;
    default: string | number | boolean;
    elements: string[];
    min?: number;
    max?: number;
    size?: number;
  }>();

  const commonProps = {
    name: "default",
    label: "Default Value",
    disabled: values.required || values.array,
    nullable: true,
    type,
  };

  const extra: Record<string, any> = {
    options: [],
  };

  switch (type) {
    case Attributes.String:
    case AttributeFormat.Email:
    case AttributeFormat.Url:
    case AttributeFormat.Ip:
    case AttributeFormat.Enum:
      extra.options.push(
        ...(type === AttributeFormat.Enum
          ? values.elements.map((v) => ({
              value: v,
              label: v,
            }))
          : []),
      );
      return (
        <DynamicField
          {...{
            ...commonProps,
            ...extra,
          }}
          size={values.size}
        />
      );
    case Attributes.Float:
    case Attributes.Integer:
      return <DynamicField {...commonProps} min={values.min} max={values.max} />;
    case Attributes.Boolean:
      extra.options = [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ];
      return <DynamicField {...commonProps} />;
    case Attributes.Timestamptz:
      return <DynamicField {...commonProps} />;
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
  const { refresh } = useCollectionStore((s) => s);

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
            await refresh();
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

const commonFormFields = (type: Attributes | AttributeFormat) => (
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
      {commonFormFields(Attributes.String)}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="String"
      format={Attributes.String}
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
      {commonFormFields(Attributes.Integer)}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Integer"
      format={Attributes.Integer}
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
      {commonFormFields(Attributes.Float)}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Float"
      format={Attributes.Float}
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
      {commonFormFields(Attributes.Boolean)}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Boolean"
      format={Attributes.Boolean}
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
      {commonFormFields(Attributes.Timestamptz)}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Datetime"
      format={Attributes.Timestamptz}
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
      {commonFormFields(AttributeFormat.Ip)}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="IP Attribute"
      format={AttributeFormat.Ip}
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
      {commonFormFields(AttributeFormat.Url)}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="URL"
      format={AttributeFormat.Url}
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
      {commonFormFields(AttributeFormat.Email)}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Email"
      format={AttributeFormat.Email}
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
      {commonFormFields(AttributeFormat.Enum)}
    </>
  );

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Enum"
      format={AttributeFormat.Enum}
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

  const schema = y.object({
    key: keyValidation,
    relatedCollection: y.string().optional(),
    relationType: y.string().oneOf(["oneToOne", "oneToMany", "manyToOne", "manyToMany"]).required(),
    twoWay: y.boolean().default(false),
    twoWayKey: y.string().when(["twoWay"], ([twoWay], schema) => {
      return twoWay ? schema.required("Two-way key is required when two-way is enabled") : schema;
    }),
    onDelete: y.string().oneOf(["cascade", "restrict", "setNull"]).default("setNull"),
  });

  return (
    <AttributeFormBase
      onClose={onClose}
      isOpen={isOpen}
      refetch={refetch}
      title="Relationship"
      format={Attributes.Relationship}
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
      formFields={<RelationshipAttributeFormFields />}
      submitAction={async (values) => {
        const { key, relatedCollection, relationType, twoWay, twoWayKey, onDelete } = values;
        await sdk.databases.createRelationshipAttribute(
          database!.$id,
          collection!.$id,
          relatedCollection,
          relationType,
          twoWay,
          key,
          twoWay ? twoWayKey : undefined,
          onDelete,
        );
      }}
    />
  );
};

const RelationshipAttributeFormFields = () => {
  const { values, setFieldValue, errors } = useFormikContext<{
    key: string;
    relatedCollection: string;
    relationType: "oneToOne" | "oneToMany" | "manyToOne" | "manyToMany";
    twoWay: boolean;
    twoWayKey: string;
    onDelete: "cascade" | "restrict" | "setNull";
  }>();
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!()!;

  const { data } = useQuery({
    queryKey: ["collections", database!.$id],
    queryFn: async () => {
      return await sdk.databases.listCollections(database!.$id);
    },
    enabled: !!database,
  });

  return (
    <>
      <RadioCardRoot
        flexDirection="row"
        gap={4}
        width={"full"}
        value={values.twoWay ? "twoWay" : "oneWay"}
        onValueChange={(d) => {
          setFieldValue("twoWay", d.value === "twoWay");
          !values.twoWayKey &&
            setFieldValue(
              "twoWayKey",
              collection?.name?.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "",
            );
        }}
      >
        <RadioCardItem
          icon={<RelationshipIcon type="oneWay" />}
          label="One-Way"
          value="oneWay"
          description="Creates a relationship that references the related collection only from this collection"
        />
        <RadioCardItem
          icon={<RelationshipIcon type="twoWay" />}
          label="Two-Way"
          value="twoWay"
          description="Creates a bidirectional relationship that allows navigation between both collections"
        />
      </RadioCardRoot>

      <SelectField
        name="relatedCollection"
        label="Related Collection"
        value={values.relatedCollection}
        onChange={(value) => {
          setFieldValue("relatedCollection", value.target.value);
          !values.key &&
            setFieldValue(
              "key",
              data?.collections
                .find((c: any) => c.$id === value.target.value)
                ?.name?.replace(/[^a-zA-Z0-9]/g, "")
                .toLowerCase() || "",
            );
        }}
        required
        options={
          data?.collections
            .filter((c: any) => c.$id !== collection.$id)
            .map((collection: any) => ({
              value: collection.$id,
              label: `${collection.name} (${collection.$id})`,
            })) ?? []
        }
        searchable
        emptyState="There are no collections that match your search"
      />

      {values.relatedCollection && (
        <>
          <InputField
            name="key"
            label="Key"
            required
            description="Key must contain only alphanumeric, hyphen, non-leading underscore, period"
          />

          {values.twoWay && (
            <InputField
              name="twoWayKey"
              label="Key (Related Collection)"
              required
              description="Key must contain only alphanumeric, hyphen, non-leading underscore, period"
            />
          )}

          <DynamicField
            name="relationType"
            label="Relation Type"
            type={AttributeFormat.Enum}
            options={[
              { value: "oneToOne", label: "One to One" },
              { value: "oneToMany", label: "One to Many" },
              { value: "manyToOne", label: "Many to One" },
              { value: "manyToMany", label: "Many to Many" },
            ]}
          />

          <Column className="mt-2 mb-2">
            {(() => {
              const relatedCollection = data?.collections.find(
                (c: any) => c.$id === values.relatedCollection,
              )?.name;
              if (!relatedCollection) return null;

              const relationships: Record<string, string[]> = {
                oneToOne: values.twoWay
                  ? [
                      `${collection.name} can contain one ${relatedCollection}.`,
                      `${relatedCollection} can belong to one ${collection.name}.`,
                    ]
                  : [`${collection.name} can contain one ${relatedCollection}.`],
                oneToMany: [
                  `${collection.name} can contain many ${relatedCollection}.`,
                  `${relatedCollection} can belong to one ${collection.name}.`,
                ],
                manyToOne: [
                  `${collection.name} can belong to one ${relatedCollection}.`,
                  ...(values.twoWay
                    ? [`${relatedCollection} can contain many ${collection.name}.`]
                    : []),
                ],
                manyToMany: [
                  `${collection.name} can contain many ${relatedCollection}.`,
                  `${relatedCollection} can belong to many ${collection.name}.`,
                ],
              };

              return (
                <div className="p-3 bg-[var(--neutral-alpha-weak)] rounded-md text-sm text-center">
                  <div className="flex items-center self-center mx-auto gap-4 w-min text-nowrap mb-2">
                    {collection.name}
                    {values.twoWay ? (
                      <MoveHorizontal className="h-6 w-6" />
                    ) : (
                      <MoveRight className="h-6 w-6" />
                    )}
                    {relatedCollection}
                  </div>
                  {relationships[values.relationType]?.map((text, index) => (
                    <div key={index}>
                      <span className="font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </Column>

          <DynamicField
            name="onDelete"
            label="On Delete Action"
            type={AttributeFormat.Enum}
            options={[
              { value: "cascade", label: "Cascade" },
              { value: "restrict", label: "Restrict" },
              { value: "setNull", label: "Set Null" },
            ]}
          />
        </>
      )}
    </>
  );
};
