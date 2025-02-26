import { useFormikContext } from "formik";
import { PermissionsEditor, PermissionsEditorProps } from "./permissions";

type Props = {
  name: string;
};

export const PermissionField = (
  props: Omit<PermissionsEditorProps, "permissions" | "onChange"> & Props,
) => {
  const { name, ...rest } = props;
  const { errors, setFieldValue, initialValues } = useFormikContext<Record<string, string[]>>();

  return (
    <>
      <PermissionsEditor
        permissions={initialValues[name] ?? []}
        onChange={(updatedPermissions) => setFieldValue(name, updatedPermissions)}
        {...rest}
      />
    </>
  );
};
