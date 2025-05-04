import { FieldProps } from "@/components/cui/field";

export type RootFieldProps = Pick<
  FieldProps,
  "label" | "errorText" | "helperText" | "optionalText" | "orientation"
>;
