import * as y from "yup";

export const validationSchema = y.object({
  key: y.string().required("Key is required"),
  type: y.string().oneOf(["key", "unique", "fulltext"]).required("Index type is required"),
  fields: y
    .object()
    .test("is-valid-sort-field", "Each attribute must have a valid sort order", (value) => {
      if (!value || Object.keys(value).length < 1) {
        return false;
      }

      return Object.values(value).every((item) => {
        return item === "ASC" || item === "DESC";
      });
    }),
});

export enum IndexType {
  KEY = "key",
  UNIQUE = "unique",
  FULLTEXT = "fulltext",
}
