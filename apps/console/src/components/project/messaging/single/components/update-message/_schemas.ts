import * as y from "yup";

// Email specific schema
const emailSpecificSchema = y.object().shape({
  subject: y.string().required("Subject is required"),
  message: y.string().required("Message is required"),
  html: y.boolean().optional(),
});

// SMS specific schema
const smsSpecificSchema = y.object().shape({
  message: y.string().max(900).required("Message is required"),
});

// Push specific schema
const pushSpecificSchema = y.object().shape({
  title: y.string().required("Title is required"),
  message: y.string().max(1000).required("Message is required"),
  image: y
    .string()
    .matches(/^[^:]{1,36}:[^:]{1,36}$/, "Image must be in format <bucketId>:<fileId>")
    .optional(),
  data: y
    .object()
    .shape({
      key: y.string().optional(),
      value: y.string().optional(),
    })
    .optional(),
});

// Combined schemas
export const emailSchema = emailSpecificSchema;

export const smsSchema = smsSpecificSchema;

export const pushSchema = pushSpecificSchema;
