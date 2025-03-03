import { Models } from "@nuvix/console";
import * as Yup from "yup";

type AttributeTypes = Models.AttributeString | Models.AttributeInteger | Models.AttributeBoolean;

export const generateYupSchema = (attributes: AttributeTypes[]) => {
  const schema: Record<string, Yup.AnySchema> = {};

  const setReq = <T extends Yup.AnySchema = any>(attribute: any, fieldSchema: T): T => {
    if (attribute.required) {
      return fieldSchema.required(`${attribute.key} is required`);
    } else {
      return fieldSchema.nullable().optional();
    }
  };

  attributes.forEach((attribute) => {
    let fieldSchema: Yup.AnySchema;

    switch (attribute.type) {
      case "string":
        fieldSchema = Yup.string();
        if ("format" in attribute) {
          if (attribute.format === "email") {
            fieldSchema = (fieldSchema as Yup.StringSchema).email("Invalid email format");
          } else if (attribute.format === "url") {
            fieldSchema = (fieldSchema as Yup.StringSchema).url("Invalid URL format");
          }
        }
        if ((attribute as Models.AttributeString).size) {
          fieldSchema = (fieldSchema as Yup.StringSchema).max(
            (attribute as Models.AttributeString).size!,
            `Maximum ${(attribute as Models.AttributeString).size} characters allowed`,
          );
        }
        fieldSchema = setReq(attribute, fieldSchema);
        break;

      case "integer":
        fieldSchema = Yup.number().integer("Must be an integer");
        if ((attribute as Models.AttributeInteger).min !== undefined) {
          fieldSchema = (fieldSchema as Yup.NumberSchema).min(
            (attribute as Models.AttributeInteger).min!,
            `Must be at least ${(attribute as Models.AttributeInteger).min}`,
          );
        }
        if ((attribute as Models.AttributeInteger).max !== undefined) {
          fieldSchema = (fieldSchema as Yup.NumberSchema).max(
            (attribute as Models.AttributeInteger).max!,
            `Must be at most ${(attribute as Models.AttributeInteger).max}`,
          );
        }
        break;

      case "boolean":
        fieldSchema = Yup.boolean();
        break;

      case "enum":
        fieldSchema = Yup.mixed().oneOf(
          (attribute as Models.AttributeEnum).elements!,
          `Must be one of: ${(attribute as Models.AttributeEnum).elements.join(", ")}`,
        );
        break;

      default:
        return;
    }

    // Handle array case
    if (attribute.array) {
      fieldSchema = Yup.array().of(fieldSchema);
    }

    // Handle required and nullable case
    if (attribute.required) {
      fieldSchema = fieldSchema.required(`${attribute.key} is required`);
    } else {
      fieldSchema = fieldSchema.nullable().optional();
    }

    schema[attribute.key] = fieldSchema;
  });

  return Yup.object().shape(schema);
};
