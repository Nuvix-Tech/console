import * as y from "yup";

// Schedule schema
export const scheduleSchema = y.object().shape({
  schedule: y.string().oneOf(["now", "schedule"]).required("Schedule type is required"),
  date: y.string().when("schedule", {
    is: "schedule",
    then: (schema) => schema.required("Date is required when scheduling"),
    otherwise: (schema) => schema.optional(),
  }),
  time: y.string().when("schedule", {
    is: "schedule",
    then: (schema) => schema.required("Time is required when scheduling"),
    otherwise: (schema) => schema.optional(),
  }),
});

// Common fields schema
const commonFieldsSchema = y.object().shape({
  id: y.string().min(6).max(36).optional(),
  topics: y.array().of(y.string()).optional(),
  targets: y.array().of(y.string()).optional(),
});

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
export const emailSchema = emailSpecificSchema.concat(commonFieldsSchema).concat(scheduleSchema);

export const smsSchema = smsSpecificSchema.concat(commonFieldsSchema).concat(scheduleSchema);

export const pushSchema = pushSpecificSchema.concat(commonFieldsSchema).concat(scheduleSchema);
