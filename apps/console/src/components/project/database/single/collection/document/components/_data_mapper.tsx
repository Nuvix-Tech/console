import { Models } from "@nuvix/console";
import { UpdateField } from "./_data_field";
import { DynamicField, FIELD_TYPES } from ".";
import { generateYupSchema } from "./_utils";

type AttributeTypes = Models.AttributeString | Models.AttributeInteger | Models.AttributeBoolean;

interface DataMapperProps<T = Models.Document> {
  document: T;
  attributes: AttributeTypes[];
}

export const DataMapper = <T,>({ attributes, document }: DataMapperProps<T>) => {
  return attributes.map((attribute, index) => {
    let schema = generateYupSchema([attribute]);
    const commonProps = {
      name: attribute.key,
      nullable: !attribute.required,
      isArray: attribute.array,
      type: "string" as (typeof FIELD_TYPES)[number],
      options: !attribute.required ? [{ value: "null", label: "NULL" }] : [],
    };

    switch (attribute.type) {
      case "string":
        if ("format" in attribute) {
          switch (attribute.format) {
            case "email":
              commonProps.type = "email";
              break;
            case "url":
              commonProps.type = "url";
              break;
            case "enum":
              commonProps.type = "enum";
              commonProps.options.push(
                ...(attribute as Models.AttributeEnum).elements.map((v) => ({
                  value: v,
                  label: v,
                })),
              );
              break;
          }
        }
        return (
          <UpdateField
            schema={schema}
            name={attribute.key}
            value={document[attribute.key as keyof T]}
            key={index}
            attribute={attribute}
          >
            <DynamicField {...commonProps} size={(attribute as Models.AttributeString)?.size} />
          </UpdateField>
        );
      case "integer":
        return (
          <UpdateField
            name={attribute.key}
            schema={schema}
            value={document[attribute.key as keyof T]}
            key={index}
            attribute={attribute}
          >
            <DynamicField
              {...commonProps}
              min={(attribute as Models.AttributeInteger).min}
              max={(attribute as Models.AttributeInteger).max}
              type="integer"
            />
          </UpdateField>
        );
      case "boolean":
        commonProps.options = [
          { value: "true", label: "True" },
          { value: "false", label: "False" },
        ];
        return (
          <UpdateField
            schema={schema}
            name={attribute.key}
            value={document[attribute.key as keyof T]}
            key={index}
            attribute={attribute}
          >
            <DynamicField {...commonProps} type="boolean" />
          </UpdateField>
        );
      default:
        return null;
    }
  });
};
