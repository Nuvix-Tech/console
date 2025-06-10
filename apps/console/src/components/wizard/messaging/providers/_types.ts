import { MessagingProviderType } from "@nuvix/console";

// Provider types definitions
export type ProviderName = {
  [MessagingProviderType.Email]: "mailgun" | "sendgrid" | "smtp";
  [MessagingProviderType.Push]: "fcm" | "apns";
  [MessagingProviderType.Sms]: "twilio" | "msg91" | "telesign" | "textmagic" | "vonage";
};

// Base provider form data interface
export interface BaseProviderFormData {
  providerId?: string;
  name: string;
  enabled: boolean;
}

// Email provider form data
export interface EmailProviderFormData extends BaseProviderFormData {
  type: MessagingProviderType.Email;
  providerType: ProviderName[MessagingProviderType.Email];
  // Mailgun
  apiKey?: string;
  domain?: string;
  fromName?: string;
  fromEmail?: string;
  // SendGrid
  sendgridApiKey?: string;
  // SMTP
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
}

// SMS provider form data
export interface SmsProviderFormData extends BaseProviderFormData {
  type: MessagingProviderType.Sms;
  providerType: ProviderName[MessagingProviderType.Sms];
  // Twilio
  accountSid?: string;
  authToken?: string;
  from?: string;
  // MSG91
  msg91ApiKey?: string;
  msg91SenderId?: string;
  msg91Route?: string;
  // Telesign
  telesignCustomerId?: string;
  telesignApiKey?: string;
  // Textmagic
  textmagicUsername?: string;
  textmagicApiKey?: string;
  // Vonage
  vonageApiKey?: string;
  vonageApiSecret?: string;
  vonageFrom?: string;
}

// Push provider form data
export interface PushProviderFormData extends BaseProviderFormData {
  type: MessagingProviderType.Push;
  providerType: ProviderName[MessagingProviderType.Push];
  // FCM
  fcmServerKey?: string;
  fcmSenderId?: string;
  fcmProjectId?: string;
  // APNS
  apnsKeyId?: string;
  apnsTeamId?: string;
  apnsBundleId?: string;
  apnsKey?: string;
  apnsProduction?: boolean;
}

// Union type for all provider form data
export type ProviderFormData = EmailProviderFormData | SmsProviderFormData | PushProviderFormData;

// Type guard functions
export const isEmailProviderFormData = (data: ProviderFormData): data is EmailProviderFormData => {
  return data.type === MessagingProviderType.Email;
};

export const isSmsProviderFormData = (data: ProviderFormData): data is SmsProviderFormData => {
  return data.type === MessagingProviderType.Sms;
};

export const isPushProviderFormData = (data: ProviderFormData): data is PushProviderFormData => {
  return data.type === MessagingProviderType.Push;
};

// Initial values factory
export const getInitialValues = (type: MessagingProviderType): ProviderFormData => {
  const baseValues: BaseProviderFormData = {
    name: "",
    enabled: true,
  };

  switch (type) {
    case MessagingProviderType.Email:
      return {
        ...baseValues,
        type: MessagingProviderType.Email,
        providerType: "mailgun",
        fromName: "",
        fromEmail: "",
      } as EmailProviderFormData;

    case MessagingProviderType.Sms:
      return {
        ...baseValues,
        type: MessagingProviderType.Sms,
        providerType: "twilio",
        from: "",
      } as SmsProviderFormData;

    case MessagingProviderType.Push:
      return {
        ...baseValues,
        type: MessagingProviderType.Push,
        providerType: "fcm",
        apnsProduction: false,
      } as PushProviderFormData;

    default:
      throw new Error(`Unsupported messaging type: ${type}`);
  }
};

// Provider config interface
export interface ProviderConfig {
  schema: any;
  component: React.ComponentType;
  initialValues: ProviderFormData;
}
