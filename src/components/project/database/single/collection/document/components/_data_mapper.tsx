import { Models } from "@nuvix/console";

interface DataMapperProps<T = Models.Document> {
  document: T;
  attributes: (Models.AttributeString | Models.AttributeInteger)[];
}

export const DataMapper = <T,>({ attributes, document }: DataMapperProps<T>) => {
  return attributes.map((att, i) => {
    switch (att.type) {
      case "string":
        return "STRING";
      default:
        return null;
    }
  });
};
