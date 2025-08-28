"use client";

import React, { useEffect, useMemo } from "react";
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
import { useFormikContext, type FormikValues, type FormikHelpers } from "formik";
import { DynamicField, SelectField } from "../../../schema/single/collection/document/components";
import { useQuery } from "@tanstack/react-query";
import { RadioCardItem, RadioCardRoot } from "@nuvix/cui/radio-card";
import { MoveHorizontal, MoveRight } from "lucide-react";
import { AttributeFormat, Attributes } from "./utils";
import type { Models, RelationMutate, RelationshipType } from "@nuvix/console";
import type { ProjectSdk } from "@/lib/sdk";

// ======================== TYPE DEFINITIONS ========================

interface BaseProps {
  onClose: () => void;
  isOpen: boolean;
  refetch: () => Promise<void>;
}

interface AttributeFormValues {
  key: string;
  required: boolean;
  array: boolean;
  default?: any;
}

interface StringFormValues extends AttributeFormValues {
  size: number;
}

interface NumericFormValues extends AttributeFormValues {
  min?: number | null;
  max?: number | null;
}

interface EnumFormValues extends AttributeFormValues {
  elements: string[];
}

interface RelationshipFormValues {
  key: string;
  relatedCollection: string;
  relationType: "oneToOne" | "oneToMany" | "manyToOne" | "manyToMany";
  twoWay: boolean;
  twoWayKey: string;
  onDelete: "cascade" | "restrict" | "setNull";
}

interface AttributeConfig<T = any> {
  title: string;
  format: string;
  description: string;
  initialValues: T;
  validationSchema: y.Schema<T>;
  formFields: React.ReactNode;
  submitAction: (values: T) => Promise<any>;
  updateAction: (key: string, values: T) => Promise<any>;
}

interface AttributeFormBaseProps<T = any> extends BaseProps {
  title: string;
  format: string;
  description: string;
  initialValues: T;
  validationSchema: y.Schema<T>;
  formFields: React.ReactNode;
  submitAction: (values: T) => Promise<void>;
}

// ======================== CONSTANTS ========================

const KEY_VALIDATION_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9\-_.]*$/;
const KEY_VALIDATION_MESSAGE =
  "Key must contain only alphanumeric, hyphen, non-leading underscore, period";

const BOOLEAN_OPTIONS = [
  { value: "true", label: "True" },
  { value: "false", label: "False" },
] as const;

const RELATION_TYPE_OPTIONS = [
  { value: "oneToOne", label: "One to One" },
  { value: "oneToMany", label: "One to Many" },
  { value: "manyToOne", label: "Many to One" },
  { value: "manyToMany", label: "Many to Many" },
] as const;

const ON_DELETE_OPTIONS = [
  { value: "cascade", label: "Cascade" },
  { value: "restrict", label: "Restrict" },
  { value: "setNull", label: "Set Null" },
] as const;

// ======================== VALIDATION SCHEMAS ========================

const keyValidation = y
  .string()
  .required("Key is required")
  .matches(KEY_VALIDATION_PATTERN, KEY_VALIDATION_MESSAGE);

const createDefaultValidation = <T extends any>(baseSchema: y.Schema<T>) =>
  baseSchema.test(
    "null-if-required-or-array",
    "Default must be null when required or array is true",
    function (value) {
      const parent = this.parent as AttributeFormValues;
      if (!parent) return true;
      if (parent.required || parent.array) {
        return value === null || value === undefined;
      }
      return true;
    },
  );

// ======================== SHARED COMPONENTS ========================

const KeyField: React.FC = () => (
  <InputField name="key" label="Key" required description={KEY_VALIDATION_MESSAGE} />
);

const DefaultValueField: React.FC<{ type: Attributes | AttributeFormat }> = ({ type }) => {
  const { values } = useFormikContext<
    AttributeFormValues & EnumFormValues & NumericFormValues & StringFormValues
  >();

  const commonProps = useMemo(
    () => ({
      name: "default",
      label: "Default Value",
      disabled: !!(values.required || values.array),
      nullable: true,
      type,
    }),
    [values.required, values.array, type],
  );

  const fieldProps = useMemo(() => {
    switch (type) {
      case AttributeFormat.Enum:
        return {
          ...commonProps,
          options: values.elements?.map((v) => ({ value: v, label: v })) || [],
        };

      case Attributes.String:
      case AttributeFormat.Email:
      case AttributeFormat.Url:
      case AttributeFormat.Ip:
        return {
          ...commonProps,
          size: (values as StringFormValues).size,
        };

      case Attributes.Float:
      case Attributes.Integer:
        return {
          ...commonProps,
          min: (values as NumericFormValues).min,
          max: (values as NumericFormValues).max,
        };

      case Attributes.Boolean:
        return {
          ...commonProps,
          options: BOOLEAN_OPTIONS,
        };

      default:
        return commonProps;
    }
  }, [type, commonProps, values]);

  return <DynamicField {...(fieldProps as any)} />;
};

const RequiredField: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<AttributeFormValues>();

  useEffect(() => {
    if (values.required) {
      setFieldValue("array", false);
      setFieldValue("default", null);
    }
  }, [values.required, setFieldValue]);

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

const ArrayField: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { values, setFieldValue } = useFormikContext<AttributeFormValues>();

  useEffect(() => {
    if (values.array) {
      setFieldValue("required", false);
      setFieldValue("default", null);
    }
  }, [values.array, setFieldValue]);

  return (
    <InputSwitchField
      className="gap-0"
      name="array"
      label="Is Array"
      description="Allows storing multiple values of this type"
      reverse
      disabled={disabled || values.required}
    />
  );
};

const MinMaxFields: React.FC = () => (
  <Row gap="8">
    <InputNumberField name="min" label="Minimum" nullable />
    <InputNumberField name="max" label="Maximum" nullable />
  </Row>
);

// ======================== FORM BASE COMPONENT ========================

const AttributeFormBase = <T extends FormikValues>({
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
}: AttributeFormBaseProps<T>) => {
  const { addToast } = useToast();
  const { refresh } = useCollectionStore((s) => s);

  const handleSubmit = async (
    values: FormikValues,
    _formikHelpers: FormikHelpers<FormikValues>,
  ) => {
    try {
      await submitAction(values as T);
      addToast({
        message: "Attribute created successfully",
        variant: "success",
      });
      onClose();
      await refetch();
      await refresh();
    } catch (error: any) {
      addToast({
        message: error?.message ?? "Failed to create attribute",
        variant: "danger",
      });
    }
  };

  return (
    <FormDialog
      dialog={{
        title: (
          <Row gap="8">
            {AttributeIcon({ format })}
            {title}
          </Row>
        ),
        description,
        isOpen,
        onClose,
        footer: <SubmitButton label="Create" />,
      }}
      form={{
        validationSchema,
        initialValues,
        onSubmit: handleSubmit,
      }}
    >
      <Column paddingY="12" fillWidth gap="16">
        {formFields}
      </Column>
    </FormDialog>
  );
};

// ======================== ATTRIBUTE CONFIG FACTORY ========================

export class AttributeConfigFactory {
  private forUpdate: boolean;
  constructor(
    private sdk: ProjectSdk,
    private database: any,
    private collection: any,
    private column?: Models.AttributeString,
  ) {
    this.forUpdate = column ? true : false;
  }

  private createStringConfig(): AttributeConfig<StringFormValues> {
    return {
      title: "String",
      format: Attributes.String,
      description: "Create a new string attribute for this collection",
      initialValues: {
        key: "",
        size: 255,
        default: null,
        required: false,
        array: false,
      },
      validationSchema: y.object({
        key: keyValidation,
        size: y.number().positive().integer().required(),
        default: createDefaultValidation(y.string().nullable()),
        required: y.boolean().default(false),
        array: y.boolean().default(false),
      }),
      formFields: (
        <>
          <KeyField />
          <InputNumberField name="size" label="Size" required />
          <DefaultValueField type={Attributes.String} />
          <RequiredField />
          <ArrayField disabled={this.forUpdate} />
        </>
      ),
      submitAction: async (values) => {
        const { key, size, default: defaultValue, required, array } = values;
        return this.sdk.databases.createStringAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          size,
          required,
          defaultValue,
          array,
        );
      },
      updateAction: (key, values) => {
        const { required, default: x, size, key: newKey } = values;
        return this.sdk.databases.updateStringAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          x,
          size,
          key === newKey ? undefined : newKey,
        );
      },
    };
  }

  private createIntegerConfig(): AttributeConfig<NumericFormValues> {
    return {
      title: "Integer",
      format: Attributes.Integer,
      description: "Create a new integer attribute for this collection",
      initialValues: {
        key: "",
        default: null,
        required: false,
        array: false,
        min: null,
        max: null,
      },
      validationSchema: y.object({
        key: keyValidation,
        default: createDefaultValidation(y.number().integer().nullable()),
        required: y.boolean().default(false),
        array: y.boolean().default(false),
        min: y.number().integer().nullable(),
        max: y.number().integer().nullable(),
      }),
      formFields: (
        <>
          <KeyField />
          <MinMaxFields />
          <DefaultValueField type={Attributes.Integer} />
          <RequiredField />
          <ArrayField disabled={this.forUpdate} />
        </>
      ),
      submitAction: async (values) => {
        const { key, default: defaultValue, required, array, min, max } = values;
        return await this.sdk.databases.createIntegerAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          min ?? undefined,
          max ?? undefined,
          defaultValue,
          array,
        );
      },
      updateAction: (key, values) => {
        const { required, default: x, min, max, key: newKey } = values;
        return this.sdk.databases.updateIntegerAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          min!,
          max!,
          x,
          key === newKey ? undefined : newKey,
        );
      },
    };
  }

  private createFloatConfig(): AttributeConfig<NumericFormValues> {
    return {
      title: "Float",
      format: Attributes.Float,
      description: "Create a new float attribute for this collection",
      initialValues: {
        key: "",
        default: null,
        required: false,
        array: false,
        min: null,
        max: null,
      },
      validationSchema: y.object({
        key: keyValidation,
        default: createDefaultValidation(y.number().nullable()),
        required: y.boolean().default(false),
        array: y.boolean().default(false),
        min: y.number().nullable(),
        max: y.number().nullable(),
      }),
      formFields: (
        <>
          <KeyField />
          <MinMaxFields />
          <DefaultValueField type={Attributes.Float} />
          <RequiredField />
          <ArrayField disabled={this.forUpdate} />
        </>
      ),
      submitAction: async (values) => {
        const { key, default: defaultValue, required, array, min, max } = values;
        return await this.sdk.databases.createFloatAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          min?? undefined,
          max?? undefined,
          defaultValue,
          array,
        );
      },
      updateAction: (key, values) => {
        const { required, default: x, min, max, key: newKey } = values;
        return this.sdk.databases.updateFloatAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          min!,
          max!,
          x,
          key === newKey ? undefined : newKey,
        );
      },
    };
  }

  private createBooleanConfig(): AttributeConfig<AttributeFormValues> {
    return {
      title: "Boolean",
      format: Attributes.Boolean,
      description: "Create a new boolean attribute for this collection",
      initialValues: {
        key: "",
        default: null,
        required: false,
        array: false,
      },
      validationSchema: y.object({
        key: keyValidation,
        default: createDefaultValidation(y.boolean().nullable()),
        required: y.boolean().default(false),
        array: y.boolean().default(false),
      }),
      formFields: (
        <>
          <KeyField />
          <DefaultValueField type={Attributes.Boolean} />
          <RequiredField />
          <ArrayField disabled={this.forUpdate} />
        </>
      ),
      submitAction: async (values) => {
        const { key, default: defaultValue, required, array } = values;
        return await this.sdk.databases.createBooleanAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          defaultValue,
          array,
        );
      },
      updateAction: (key, values) => {
        const { required, default: x, key: newKey } = values;
        return this.sdk.databases.updateBooleanAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          x,
          key === newKey ? undefined : newKey,
        );
      },
    };
  }

  private createDatetimeConfig(): AttributeConfig<AttributeFormValues> {
    return {
      title: "Datetime",
      format: Attributes.Timestamptz,
      description: "Create a new datetime attribute for this collection",
      initialValues: {
        key: "",
        default: null,
        required: false,
        array: false,
      },
      validationSchema: y.object({
        key: keyValidation,
        default: createDefaultValidation(y.string().nullable()),
        required: y.boolean().default(false),
        array: y.boolean().default(false),
      }),
      formFields: (
        <>
          <KeyField />
          <DefaultValueField type={Attributes.Timestamptz} />
          <RequiredField />
          <ArrayField disabled={this.forUpdate} />
        </>
      ),
      submitAction: async (values) => {
        const { key, default: defaultValue, required, array } = values;
        return await this.sdk.databases.createDatetimeAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          defaultValue,
          array,
        );
      },
      updateAction: (key, values) => {
        const { required, default: x, key: newKey } = values;
        return this.sdk.databases.updateDatetimeAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          x,
          key === newKey ? undefined : newKey,
        );
      },
    };
  }

  private createIpConfig(): AttributeConfig<AttributeFormValues> {
    return {
      title: "IP Attribute",
      format: AttributeFormat.Ip,
      description: "Create a new IP address attribute for this collection",
      initialValues: {
        key: "",
        default: null,
        required: false,
        array: false,
      },
      validationSchema: y.object({
        key: keyValidation,
        default: createDefaultValidation(y.string().nullable()),
        required: y.boolean().default(false),
        array: y.boolean().default(false),
      }),
      formFields: (
        <>
          <KeyField />
          <DefaultValueField type={AttributeFormat.Ip} />
          <RequiredField />
          <ArrayField disabled={this.forUpdate} />
        </>
      ),
      submitAction: async (values) => {
        const { key, default: defaultValue, required, array } = values;
        return await this.sdk.databases.createIpAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          defaultValue,
          array,
        );
      },
      updateAction: (key, values) => {
        const { required, default: x, key: newKey } = values;
        return this.sdk.databases.updateIpAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          x,
          key === newKey ? undefined : newKey,
        );
      },
    };
  }

  private createUrlConfig(): AttributeConfig<AttributeFormValues> {
    return {
      title: "URL",
      format: AttributeFormat.Url,
      description: "Create a new URL attribute for this collection",
      initialValues: {
        key: "",
        default: null,
        required: false,
        array: false,
      },
      validationSchema: y.object({
        key: keyValidation,
        default: createDefaultValidation(y.string().url().nullable()),
        required: y.boolean().default(false),
        array: y.boolean().default(false),
      }),
      formFields: (
        <>
          <KeyField />
          <DefaultValueField type={AttributeFormat.Url} />
          <RequiredField />
          <ArrayField disabled={this.forUpdate} />
        </>
      ),
      submitAction: async (values) => {
        const { key, default: defaultValue, required, array } = values;
        return await this.sdk.databases.createUrlAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          defaultValue,
          array,
        );
      },
      updateAction: (key, values) => {
        const { required, default: x, key: newKey } = values;
        return this.sdk.databases.updateUrlAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          x,
          key === newKey ? undefined : newKey,
        );
      },
    };
  }

  private createEmailConfig(): AttributeConfig<AttributeFormValues> {
    return {
      title: "Email",
      format: AttributeFormat.Email,
      description: "Create a new email attribute for this collection",
      initialValues: {
        key: "",
        default: null,
        required: false,
        array: false,
      },
      validationSchema: y.object({
        key: keyValidation,
        default: createDefaultValidation(y.string().email().nullable()),
        required: y.boolean().default(false),
        array: y.boolean().default(false),
      }),
      formFields: (
        <>
          <KeyField />
          <DefaultValueField type={AttributeFormat.Email} />
          <RequiredField />
          <ArrayField disabled={this.forUpdate} />
        </>
      ),
      submitAction: async (values) => {
        const { key, default: defaultValue, required, array } = values;
        return await this.sdk.databases.createEmailAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          defaultValue,
          array,
        );
      },
      updateAction: (key, values) => {
        const { required, default: x, key: newKey } = values;
        return this.sdk.databases.updateEmailAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          required,
          x,
          key === newKey ? undefined : newKey,
        );
      },
    };
  }

  private createEnumConfig(): AttributeConfig<EnumFormValues> {
    return {
      title: "Enum",
      format: AttributeFormat.Enum,
      description: "Create a new enum attribute for this collection",
      initialValues: {
        key: "",
        elements: [],
        default: null,
        required: false,
        array: false,
      },
      validationSchema: y.object({
        key: keyValidation,
        elements: y
          .array()
          .of(y.string().required())
          .min(1, "At least one element is required")
          .required(),
        default: y
          .string()
          .nullable()
          .test("enum-default-check", "Default must be one of the enum elements", function (value) {
            const parent = this.parent as EnumFormValues;
            if (!parent) return true;
            if (parent.required || parent.array) {
              return value === null || value === undefined;
            }
            if (value === null || value === undefined) return true;
            return parent.elements?.includes(value) ?? false;
          }),
        required: y.boolean().default(false),
        array: y.boolean().default(false),
      }),
      formFields: (
        <>
          <KeyField />
          <InputTagField name="elements" label="Elements" />
          <DefaultValueField type={AttributeFormat.Enum} />
          <RequiredField />
          <ArrayField disabled={this.forUpdate} />
        </>
      ),
      submitAction: async (values) => {
        const { key, elements, default: defaultValue, required, array } = values;
        return await this.sdk.databases.createEnumAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          elements,
          required,
          defaultValue,
          array,
        );
      },
      updateAction: (key, values) => {
        const { required, default: x, elements,  key: newKey } = values;
        return this.sdk.databases.updateEnumAttribute(
          this.database.$id,
          this.collection.$id,
          key,
          elements,
          required,
          x,
          key === newKey ? undefined : newKey,
        );
      },
    };
  }

  private createRelationshipConfig(): AttributeConfig<RelationshipFormValues> {
    return {
      title: "Relationship",
      format: Attributes.Relationship,
      description: "Create a new relationship attribute for this collection",
      initialValues: {
        key: "",
        relatedCollection: "",
        relationType: "oneToOne",
        twoWay: false,
        twoWayKey: "",
        onDelete: "setNull",
      },
      validationSchema: y.object({
        key: keyValidation,
        relatedCollection: y.string().required("Related collection is required"),
        relationType: y
          .string()
          .oneOf(["oneToOne", "oneToMany", "manyToOne", "manyToMany"])
          .required(),
        twoWay: y.boolean().default(false),
        twoWayKey: y.string().when(["twoWay"], ([twoWay], schema) => {
          return twoWay
            ? schema.required("Two-way key is required when two-way is enabled")
            : schema.notRequired();
        }),
        onDelete: y.string().oneOf(["cascade", "restrict", "setNull"]).default("setNull"),
      }) as any,
      formFields: <RelationshipAttributeFormFields />,
      submitAction: async (values) => {
        const { key, relatedCollection, relationType, twoWay, twoWayKey, onDelete } = values;
        return await this.sdk.databases.createRelationshipAttribute(
          this.database.$id,
          this.collection.$id,
          relatedCollection,
          relationType as RelationshipType,
          twoWay,
          key,
          twoWay ? twoWayKey : undefined,
          onDelete as RelationMutate,
        );
      },
      updateAction(key, values) {
        throw Error('currently updating relationship attribute does not supported')
      },
    };
  }

  getConfig(type: Attributes | AttributeFormat): AttributeConfig | null {
    const configMap: Record<string, () => AttributeConfig> = {
      [Attributes.String]: () => this.createStringConfig(),
      [Attributes.Integer]: () => this.createIntegerConfig(),
      [Attributes.Float]: () => this.createFloatConfig(),
      [Attributes.Boolean]: () => this.createBooleanConfig(),
      [Attributes.Timestamptz]: () => this.createDatetimeConfig(),
      [AttributeFormat.Ip]: () => this.createIpConfig(),
      [AttributeFormat.Url]: () => this.createUrlConfig(),
      [AttributeFormat.Email]: () => this.createEmailConfig(),
      [AttributeFormat.Enum]: () => this.createEnumConfig(),
      [Attributes.Relationship]: () => this.createRelationshipConfig(),
    };

    const configFactory = configMap[type as string];
    return configFactory ? configFactory() : null;
  }
}

// ======================== MAIN ATTRIBUTE FORM ========================

export const AttributeForm: React.FC<BaseProps & { type: Attributes | AttributeFormat }> = ({
  type,
  onClose,
  isOpen,
  refetch,
}) => {
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const config = useMemo(() => {
    const factory = new AttributeConfigFactory(sdk, database, collection);
    return factory.getConfig(type);
  }, [type, sdk, database, collection]);

  if (!config) return null;

  return <AttributeFormBase onClose={onClose} isOpen={isOpen} refetch={refetch} {...config} />;
};

// ======================== RELATIONSHIP FORM ========================

const RelationshipAttributeFormFields: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<RelationshipFormValues>();
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database!();
  const collection = useCollectionStore.use.collection!();

  const { data } = useQuery({
    queryKey: ["collections", database?.$id],
    queryFn: async () => {
      if (!database) return { collections: [] };
      return await sdk.databases.listCollections(database.$id);
    },
    enabled: !!database,
  });

  const relatedCollectionName = useMemo(
    () => data?.collections.find((c: any) => c.$id === values.relatedCollection)?.name,
    [data?.collections, values.relatedCollection],
  );

  const relationshipDescriptions = useMemo(() => {
    if (!relatedCollectionName) return null;

    const descriptions: Record<string, string[]> = {
      oneToOne: values.twoWay
        ? [
            `${collection?.name} can contain one ${relatedCollectionName}.`,
            `${relatedCollectionName} can belong to one ${collection?.name}.`,
          ]
        : [`${collection?.name} can contain one ${relatedCollectionName}.`],
      oneToMany: [
        `${collection?.name} can contain many ${relatedCollectionName}.`,
        `${relatedCollectionName} can belong to one ${collection?.name}.`,
      ],
      manyToOne: [
        `${collection?.name} can belong to one ${relatedCollectionName}.`,
        ...(values.twoWay
          ? [`${relatedCollectionName} can contain many ${collection?.name}.`]
          : []),
      ],
      manyToMany: [
        `${collection?.name} can contain many ${relatedCollectionName}.`,
        `${relatedCollectionName} can belong to many ${collection?.name}.`,
      ],
    };

    return descriptions[values.relationType];
  }, [collection?.name, relatedCollectionName, values.relationType, values.twoWay]);

  const handleTwoWayChange = (value: { value: string | null }) => {
    const isTwoWay = value.value === "twoWay";
    setFieldValue("twoWay", isTwoWay);
    if (isTwoWay && !values.twoWayKey) {
      setFieldValue(
        "twoWayKey",
        collection?.name?.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "",
      );
    }
  };

  const handleRelatedCollectionChange = (event: { target: { value: string | null } }) => {
    const collectionId = event.target.value;
    setFieldValue("relatedCollection", collectionId);

    if (!values.key) {
      const selectedCollection = data?.collections.find((c: any) => c.$id === collectionId);
      const generatedKey =
        selectedCollection?.name?.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "";
      setFieldValue("key", generatedKey);
    }
  };

  const collectionOptions = useMemo(
    () =>
      data?.collections
        .filter((c: any) => c.$id !== collection?.$id)
        .map((c: any) => ({
          value: c.$id,
          label: `${c.name} (${c.$id})`,
        })) ?? [],
    [data?.collections, collection?.$id],
  );

  return (
    <>
      <RadioCardRoot
        flexDirection="row"
        gap={4}
        width="full"
        value={values.twoWay ? "twoWay" : "oneWay"}
        onValueChange={handleTwoWayChange}
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
        onChange={handleRelatedCollectionChange}
        required
        options={collectionOptions}
        searchable
        emptyState="There are no collections that match your search"
      />

      {values.relatedCollection && (
        <>
          <InputField name="key" label="Key" required description={KEY_VALIDATION_MESSAGE} />

          {values.twoWay && (
            <InputField
              name="twoWayKey"
              label="Key (Related Collection)"
              required
              description={KEY_VALIDATION_MESSAGE}
            />
          )}

          <DynamicField
            name="relationType"
            label="Relation Type"
            type={AttributeFormat.Enum}
            options={RELATION_TYPE_OPTIONS as any}
          />

          {relationshipDescriptions && (
            <Column className="mt-2 mb-2">
              <div className="p-3 bg-[var(--neutral-alpha-weak)] rounded-md text-sm text-center">
                <div className="flex items-center self-center mx-auto gap-4 w-min text-nowrap mb-2">
                  {collection?.name}
                  {values.twoWay ? (
                    <MoveHorizontal className="h-6 w-6" />
                  ) : (
                    <MoveRight className="h-6 w-6" />
                  )}
                  {relatedCollectionName}
                </div>
                {relationshipDescriptions.map((text, index) => (
                  <div key={index}>
                    <span className="font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </Column>
          )}

          <DynamicField
            name="onDelete"
            label="On Delete Action"
            type={AttributeFormat.Enum}
            options={ON_DELETE_OPTIONS as any}
          />
        </>
      )}
    </>
  );
};
