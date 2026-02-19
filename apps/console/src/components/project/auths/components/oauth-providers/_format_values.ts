import { Models } from "@nuvix/console";
import * as yup from "yup";

type FormatResult = {
  initialValues: Record<string, any>;
  validationSchema: yup.ObjectSchema<any>;
  format: (
    values: Record<string, any>,
  ) => Pick<Models.AuthProvider, "appId" | "secret" | "enabled">;
};

export const formatValues = (provider: Models.AuthProvider): FormatResult => {
  const { key, appId, secret, enabled } = provider;
  let extra: Record<string, any> = {};

  try {
    extra = JSON.parse(secret || "{}");
  } catch {
    extra = {};
  }

  const baseInitial = {
    appId: appId || "",
    enabled: enabled ?? false,
  };

  const result: FormatResult = {
    initialValues: { ...baseInitial },
    validationSchema: yup.object().shape({
      appId: yup.string().required("App ID is required"),
      enabled: yup.boolean().default(false),
    }),
    format: (values) => ({
      appId: values.appId,
      secret: JSON.stringify(values),
      enabled: !!values.enabled,
    }),
  };

  const merge = (fields: string[], alwaysOptional: string[] = []) => {
    if (fields.length === 1) {
      // For single field, use direct value instead of JSON stringified
      const field = fields[0];
      result.initialValues[field] = secret;
    } else {
      for (const field of fields) {
        result.initialValues[field] = extra?.[field] || "";
      }
    }

    const shape: Record<string, yup.AnySchema> = {
      enabled: yup.boolean().default(false),
    };

    for (const field of ["appId", ...fields]) {
      shape[field] = yup.string().when(["enabled"], (values, schema) => {
        const [enabled] = values;
        if (enabled && !alwaysOptional.includes(field)) {
          return schema.required(`${field} is required`);
        }
        return schema.notRequired();
      });
    }

    result.validationSchema = yup.object().shape(shape);

    result.format = (values) => {
      if (fields.length === 1) {
        // Use direct value, not JSON stringified
        return {
          appId: values.appId,
          secret: values[fields[0]],
          enabled: !!values.enabled,
        };
      } else {
        const formatted: Record<string, string> = {};
        for (const field of fields) {
          formatted[field] = values[field];
        }
        return {
          appId: values.appId,
          secret: JSON.stringify(formatted),
          enabled: !!values.enabled,
        };
      }
    };
  };

  switch (key) {
    case "apple":
      merge(["keyID", "teamID", "p8"]);
      break;

    case "auth0":
      merge(["secret", "domain"]);
      break;

    case "microsoft":
      merge(["secret", "tenant"], ["tenant"]);
      break;

    case "oidc":
      merge([
        "secret",
        "well-known-endpoint",
        "authorization-endpoint",
        "token-endpoint",
        "userinfo-endpoint",
      ]);
      break;

    case "okta":
      merge(["secret", "domain", "serverID"]);
      break;

    default:
      merge(["secret"]);
      break;
  }

  return result;
};
