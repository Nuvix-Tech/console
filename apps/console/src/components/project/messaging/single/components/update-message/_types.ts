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

export type Props = {
  disabled?: boolean;
};
