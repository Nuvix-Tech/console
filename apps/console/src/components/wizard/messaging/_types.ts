import { MessagingProviderType } from "@nuvix/console";

// Base message form data interface
export interface BaseMessageFormData {
  id?: string;
  topics?: string[];
  targets?: string[];
  schedule: "now" | "schedule";
  date?: string;
  time?: string;
  draft?: boolean;
}

// Email specific form data
export interface EmailFormData extends BaseMessageFormData {
  subject: string;
  message: string;
  html?: boolean;
}

// SMS specific form data
export interface SmsFormData extends BaseMessageFormData {
  message: string;
}

// Push specific form data
export interface PushFormData extends BaseMessageFormData {
  title: string;
  message: string;
  image?: string;
  data?: Record<string, any>;
}

// Union type for all message form data
export type MessageFormData = EmailFormData | SmsFormData | PushFormData;

// Type guard functions
export const isEmailFormData = (data: MessageFormData): data is EmailFormData => {
  return "subject" in data && "message" in data;
};

export const isSmsFormData = (data: MessageFormData): data is SmsFormData => {
  return "message" in data && !("subject" in data) && !("title" in data);
};

export const isPushFormData = (data: MessageFormData): data is PushFormData => {
  return "title" in data && "message" in data;
};

// Initial values factory
export const getInitialValues = (type: MessagingProviderType): MessageFormData => {
  const baseValues: BaseMessageFormData = {
    schedule: "now",
    topics: [],
    targets: [],
  };

  switch (type) {
    case MessagingProviderType.Email:
      return {
        ...baseValues,
        subject: "",
        message: "",
        html: false,
      } as EmailFormData;

    case MessagingProviderType.Sms:
      return {
        ...baseValues,
        message: "",
      } as SmsFormData;

    case MessagingProviderType.Push:
      return {
        ...baseValues,
        title: "",
        message: "",
      } as PushFormData;

    default:
      throw new Error(`Unsupported messaging type: ${type}`);
  }
};

// Message config interface
export interface MessageConfig {
  schema: any;
  component: React.ComponentType;
  initialValues: MessageFormData;
}
