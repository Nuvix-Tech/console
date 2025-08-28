import { Models } from "@nuvix/console";
import * as Yup from "yup";

export type AttributeTypes =
  | Models.AttributeString
  | Models.AttributeInteger
  | Models.AttributeBoolean
  | Models.AttributeDatetime
  | Models.AttributeEmail
  | Models.AttributeEnum
  | Models.AttributeIp
  | Models.AttributeUrl
  | Models.AttributeFloat
  | Models.AttributeRelationship;

export enum Attributes {
  String = "string",
  Integer = "integer",
  Float = "float",
  Boolean = "boolean",
  Timestamptz = "timestamptz",
  Relationship = "relationship",
}

export enum AttributeFormat {
  Email = "email",
  Url = "url",
  Ip = "ip",
  Enum = "enum",
}

/**
 * Map each attribute type → Yup schema type
 */
type AttributeToYup<T extends AttributeTypes> = T extends Models.AttributeString
  ? string
  : T extends Models.AttributeInteger
    ? number
    : T extends Models.AttributeFloat
      ? number
      : T extends Models.AttributeBoolean
        ? boolean
        : T extends Models.AttributeDatetime
          ? Date
          : T extends Models.AttributeEnum
            ? T["elements"][number]
            : unknown;

type SchemaFromAttributes<T extends readonly AttributeTypes[]> = {
  [K in T[number] as K["key"]]: K["required"] extends true
    ? K["array"] extends true
      ? AttributeToYup<K>[]
      : AttributeToYup<K>
    : K["array"] extends true
      ? (AttributeToYup<K> | null | undefined)[]
      : AttributeToYup<K> | null | undefined;
};

/**
 * Apply required/optional rules consistently
 */
const applyRequirement = <T extends Yup.AnySchema>(attribute: any, schema: T): T => {
  if (attribute.required) {
    return schema.required(`${attribute.key} is required`) as T;
  }
  return schema.nullable().optional() as T;
};

/**
 * Field schema builders
 */
const schemaBuilders: Record<Attributes, (attribute: AttributeTypes) => Yup.AnySchema> = {
  [Attributes.String]: (attribute) => {
    let schema = Yup.string();

    if ("format" in attribute) {
      switch (attribute.format) {
        case AttributeFormat.Email:
          schema = schema.email("Invalid email format");
          break;
        case AttributeFormat.Url:
          schema = schema.url("Invalid URL format");
          break;
        case AttributeFormat.Ip:
          schema = schema.matches(/^(?:\d{1,3}\.){3}\d{1,3}$/, "Invalid IP format");
          break;
      }
    }

    if ("size" in attribute && attribute.size) {
      schema = schema.max(attribute.size, `Maximum ${attribute.size} characters allowed`);
    }

    return schema;
  },

  [Attributes.Integer]: (attribute) => {
    let schema = Yup.number().integer("Must be an integer");

    if ("min" in attribute && attribute.min !== undefined) {
      schema = schema.min(attribute.min, `Must be at least ${attribute.min}`);
    }
    if ("max" in attribute && attribute.max !== undefined) {
      schema = schema.max(attribute.max, `Must be at most ${attribute.max}`);
    }

    return schema;
  },

  [Attributes.Float]: (attribute) => {
    let schema = Yup.number();

    if ("min" in attribute && attribute.min !== undefined) {
      schema = schema.min(attribute.min, `Must be at least ${attribute.min}`);
    }
    if ("max" in attribute && attribute.max !== undefined) {
      schema = schema.max(attribute.max, `Must be at most ${attribute.max}`);
    }

    return schema;
  },

  [Attributes.Boolean]: () => Yup.boolean(),

  [Attributes.Timestamptz]: () => Yup.date().typeError("Must be a valid date"),

  [Attributes.Relationship]: () => Yup.mixed().nullable(),
};

/**
 * Enum schema builder
 */
const buildEnumSchema = (attribute: Models.AttributeEnum) =>
  Yup.mixed().oneOf(attribute.elements!, `Must be one of: ${attribute.elements.join(", ")}`);

/**
 * Main Yup schema generator
 */
export const generateYupSchema = <T extends readonly AttributeTypes[]>(attributes: T) => {
  const schema: Record<string, Yup.AnySchema> = {};

  for (const attribute of attributes) {
    let fieldSchema: Yup.AnySchema | null = null;

    if (
      "format" in attribute &&
      attribute.format === AttributeFormat.Enum &&
      "elements" in attribute
    ) {
      fieldSchema = buildEnumSchema(attribute as Models.AttributeEnum);
    } else if (attribute.type in schemaBuilders) {
      fieldSchema = schemaBuilders[attribute.type as Attributes](attribute);
    }

    if (!fieldSchema) continue;

    // Handle array
    if (attribute.array) {
      fieldSchema = Yup.array().of(fieldSchema);
    }

    // Apply required/optional
    fieldSchema = applyRequirement(attribute, fieldSchema);

    schema[attribute.key] = fieldSchema;
  }

  return Yup.object().shape(schema) as Yup.ObjectSchema<SchemaFromAttributes<T>>;
};

export const ATTRIBUTES = [
  { key: Attributes.String, label: "String" },
  { key: Attributes.Integer, label: "Integer" },
  { key: Attributes.Float, label: "Float" },
  { key: Attributes.Boolean, label: "Boolean" },
  { key: Attributes.Timestamptz, label: "Datetime" },
  { key: AttributeFormat.Ip, label: "IP" },
  { key: AttributeFormat.Enum, label: "Enum" },
  { key: AttributeFormat.Url, label: "URL" },
  { key: AttributeFormat.Email, label: "Email" },
  { key: Attributes.Relationship, label: "Relationship" },
] as const;
