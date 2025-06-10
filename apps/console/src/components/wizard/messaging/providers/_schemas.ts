import * as y from "yup";

// Common fields for all providers
const baseProviderSchema = y.object().shape({
  name: y.string().required("Provider name is required"),
  enabled: y.boolean().optional(),
});

// Email provider schemas
const mailgunSchema = y.object().shape({
  providerType: y.string().equals(["mailgun"]),
  apiKey: y.string().required("Mailgun API key is required"),
  domain: y.string().required("Mailgun domain is required"),
  euRegion: y.boolean().optional(),
  fromName: y.string().optional(),
  fromEmail: y.string().email("Valid email address required").required("From email is required"),
  replyToEmail: y.string().email("Valid email address required").optional(),
  replyToName: y.string().optional(),
});

const sendgridSchema = y.object().shape({
  providerType: y.string().equals(["sendgrid"]),
  apiKey: y.string().required("SendGrid API key is required"),
  fromName: y.string().optional(),
  fromEmail: y.string().email("Valid email address required").required("From email is required"),
  replyToEmail: y.string().email("Valid email address required").optional(),
  replyToName: y.string().optional(),
});

const smtpSchema = y.object().shape({
  providerType: y.string().equals(["smtp"]),
  smtpHost: y.string().required("SMTP host is required"),
  smtpPort: y.number().min(1).max(65535).optional(),
  smtpUsername: y.string().optional(),
  smtpPassword: y.string().optional(),
  smtpEncryption: y.string().oneOf(["tls", "ssl", "none"]).optional(),
  autoTLS: y.boolean().optional(),
  fromName: y.string().optional(),
  fromEmail: y.string().email("Valid email address required").required("From email is required"),
  replyToEmail: y.string().email("Valid email address required").optional(),
  replyToName: y.string().optional(),
  xMailer: y.string().optional(),
});

// SMS provider schemas
const twilioSchema = y.object().shape({
  providerType: y.string().equals(["twilio"]),
  accountSid: y.string().required("Twilio Account SID is required"),
  authToken: y.string().required("Twilio Auth Token is required"),
  from: y.string().required("From number is required"),
});

const msg91Schema = y.object().shape({
  providerType: y.string().equals(["msg91"]),
  msg91AuthKey: y.string().required("MSG91 Auth Key is required"),
  msg91SenderId: y.string().required("MSG91 Sender ID is required"),
  msg91TemplateId: y.string().required("MSG91 Template ID is required"),
});

const telesignSchema = y.object().shape({
  providerType: y.string().equals(["telesign"]),
  telesignCustomerId: y.string().required("Telesign Customer ID is required"),
  telesignApiKey: y.string().required("Telesign API key is required"),
  telesignFrom: y.string().required("Telesign from number is required"),
});

const textmagicSchema = y.object().shape({
  providerType: y.string().equals(["textmagic"]),
  textmagicUsername: y.string().required("Textmagic username is required"),
  textmagicApiKey: y.string().required("Textmagic API key is required"),
  textmagicFrom: y.string().required("Textmagic from number is required"),
});

const vonageSchema = y.object().shape({
  providerType: y.string().equals(["vonage"]),
  vonageApiKey: y.string().required("Vonage API key is required"),
  vonageApiSecret: y.string().required("Vonage API secret is required"),
  vonageFrom: y.string().required("Vonage from number is required"),
});

// Push notification provider schemas
const fcmSchema = y.object().shape({
  providerType: y.string().equals(["fcm"]),
  serviceAccountJSON: y.mixed().required("FCM Service Account JSON is required"),
});

const apnsSchema = y.object().shape({
  providerType: y.string().equals(["apns"]),
  apnsKeyId: y.string().required("APNS Key ID is required"),
  apnsTeamId: y.string().required("APNS Team ID is required"),
  apnsBundleId: y.string().required("APNS Bundle ID is required"),
  apnsKey: y.string().required("APNS Key is required"),
  apnsProduction: y.boolean().optional(),
});

// Dynamic schema based on provider type
export const getProviderSchema = (providerType: string) => {
  switch (providerType) {
    // Email providers
    case "mailgun":
      return baseProviderSchema.concat(mailgunSchema);
    case "sendgrid":
      return baseProviderSchema.concat(sendgridSchema);
    case "smtp":
      return baseProviderSchema.concat(smtpSchema);
    // SMS providers
    case "twilio":
      return baseProviderSchema.concat(twilioSchema);
    case "msg91":
      return baseProviderSchema.concat(msg91Schema);
    case "telesign":
      return baseProviderSchema.concat(telesignSchema);
    case "textmagic":
      return baseProviderSchema.concat(textmagicSchema);
    case "vonage":
      return baseProviderSchema.concat(vonageSchema);
    // Push providers
    case "fcm":
      return baseProviderSchema.concat(fcmSchema);
    case "apns":
      return baseProviderSchema.concat(apnsSchema);
    default:
      return baseProviderSchema;
  }
};

// Export individual schemas for convenience
export const emailProviderSchemas = {
  mailgun: baseProviderSchema.concat(mailgunSchema),
  sendgrid: baseProviderSchema.concat(sendgridSchema),
  smtp: baseProviderSchema.concat(smtpSchema),
};

export const smsProviderSchemas = {
  twilio: baseProviderSchema.concat(twilioSchema),
  msg91: baseProviderSchema.concat(msg91Schema),
  telesign: baseProviderSchema.concat(telesignSchema),
  textmagic: baseProviderSchema.concat(textmagicSchema),
  vonage: baseProviderSchema.concat(vonageSchema),
};

export const pushProviderSchemas = {
  fcm: baseProviderSchema.concat(fcmSchema),
  apns: baseProviderSchema.concat(apnsSchema),
};
