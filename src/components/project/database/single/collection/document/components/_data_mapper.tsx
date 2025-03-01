import { Models } from "@nuvix/console";
import { UpdateField } from "./_data_field";
import { InputField } from ".";

type Attributes = Models.AttributeString | Models.AttributeInteger | Models.AttributeBoolean;
interface DataMapperProps<T = Models.Document> {
  document: T;
  attributes: Attributes[];
}

export const DataMapper = <T,>({ attributes, document }: DataMapperProps<T>) => {
  return attributes.map((att, i) => {
    switch (att.type) {
      case "string":
        let _attribute = att as Models.AttributeString;
        return (
          <UpdateField name={att.key} value={document[att.key as keyof T]} key={i}>
            <InputField
              name={att.key}
              label={att.key}
              required={att.required}
              nullable={!att.required}
              isArray={att.array}
              size={(att as any)?.size}
            />
          </UpdateField>
        );
      case "integer":
        let attribute = att as Models.AttributeInteger;
        return (
          <UpdateField name={attribute.key} value={document[attribute.key as keyof T]} key={i}>
            <InputField
              name={attribute.key}
              label={attribute.key}
              required={attribute.required}
              nullable={!attribute.required}
              isArray={attribute.array}
              min={attribute.min}
              max={attribute.max}
              type="integer"
            />
          </UpdateField>
        );
      case "boolean":
        let boolAttribute = att as Models.AttributeBoolean;
        return (
          <UpdateField
            name={boolAttribute.key}
            value={document[boolAttribute.key as keyof T]}
            key={i}
          >
            <InputField
              name={boolAttribute.key}
              label={boolAttribute.key}
              required={boolAttribute.required}
              nullable={!boolAttribute.required}
              isArray={boolAttribute.array}
              type="boolean"
            />
          </UpdateField>
        );
      default:
        return null;
    }
  });
};
