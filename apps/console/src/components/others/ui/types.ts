import { FieldProps } from "@nuvix/cui/field";

export type RootFieldProps = Pick<
  FieldProps,
  "label" | "errorText" | "helperText" | "optionalText" | "orientation"
>;
