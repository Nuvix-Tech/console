import { CustomID } from "@/components/_custom_id";
import { CardBox } from "@/components/others/card";
import { InputField, InputSwitchField, InputSelectField } from "@/components/others/forms";
import { Column } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React from "react";
import { EmailProviderFormData, ProviderName } from "./_types";
import { MessagingProviderType } from "@nuvix/console";

const emailProviderOptions = [
  { value: "mailgun", label: "Mailgun" },
  { value: "sendgrid", label: "SendGrid" },
  { value: "smtp", label: "SMTP" },
];

export const CreateProviderTypeEmail = () => {
  const { values, setFieldValue } = useFormikContext<EmailProviderFormData>();

  const renderProviderFields = () => {
    const providerType = values.providerType as ProviderName[MessagingProviderType.Email];

    switch (providerType) {
      case "mailgun":
        return (
          <>
            <InputField name="apiKey" label="API Key" type="password" required />
            <InputField name="domain" label="Domain" placeholder="mg.example.com" required />
            <InputField name="fromName" label="From Name" placeholder="Your App" required />
            <InputField 
              name="fromEmail" 
              label="From Email" 
              type="email" 
              placeholder="noreply@example.com" 
              required 
            />
          </>
        );

      case "sendgrid":
        return (
          <>
            <InputField name="sendgridApiKey" label="API Key" type="password" required />
            <InputField name="fromName" label="From Name" placeholder="Your App" required />
            <InputField 
              name="fromEmail" 
              label="From Email" 
              type="email" 
              placeholder="noreply@example.com" 
              required 
            />
          </>
        );

      case "smtp":
        return (
          <>
            <InputField name="smtpHost" label="SMTP Host" placeholder="smtp.gmail.com" required />
            <InputField name="smtpPort" label="SMTP Port" type="number" placeholder="587" required />
            <InputField name="smtpUsername" label="Username" required />
            <InputField name="smtpPassword" label="Password" type="password" required />
            <InputSwitchField 
              name="smtpSecure" 
              label="Use TLS/SSL" 
              description="Enable secure connection"
            />
            <InputField name="fromName" label="From Name" placeholder="Your App" required />
            <InputField 
              name="fromEmail" 
              label="From Email" 
              type="email" 
              placeholder="noreply@example.com" 
              required 
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Column>
      <CardBox>
        <div className="space-y-4">
          <InputField name="name" label="Provider Name" placeholder="My Email Provider" required />
          
          <InputSelectField
            name="providerType"
            label="Provider Type"
            options={emailProviderOptions}
             required
          />

          <CustomID label="Provider ID" name="providerId" />

          {renderProviderFields()}

          <InputSwitchField 
            name="enabled" 
            label="Enable Provider" 
            description="Enable this provider for sending emails"
          />
        </div>
      </CardBox>
    </Column>
  );
};
