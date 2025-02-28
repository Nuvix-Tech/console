import { Models } from "@nuvix/console";
import { UpdateField } from "./_data_field";
import { InputField } from ".";

interface DataMapperProps<T = Models.Document> {
  document: T;
  attributes: (Models.AttributeString | Models.AttributeInteger)[];
}

export const DataMapper = <T,>({ attributes, document }: DataMapperProps<T>) => {
  return attributes.map((att, i) => {
    switch (att.type) {
      case "string":
        return (
          <UpdateField name={att.key} value={document[att.key as keyof T]} key={i}>
            <InputField name={att.key} label={att.key} required={att.required} />
          </UpdateField>
        );
      default:
        return null;
    }
  });
};
