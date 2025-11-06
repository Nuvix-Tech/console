import { CustomID } from "@/components/_custom_id";
import { CardBox, CardBoxDesc, CardBoxTitle } from "@/components/others/card";
import { InputField, InputSwitchField, InputSelectField } from "@/components/others/forms";
import { Column } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import { EmailProviderFormData, ProviderName } from "./_types";
import { MessagingProviderType } from "@nuvix/console";

const emailProviderOptions = [
  { value: "mailgun", label: "Mailgun" },
  { value: "sendgrid", label: "SendGrid" },
  { value: "smtp", label: "SMTP" },
];

export const renderEmailProviderFields = (providerType: string) => {
  switch (providerType) {
    case "mailgun":
      return (
        <>
          <InputField
            name="apiKey"
            label="API Key"
            placeholder="Enter API key"
            type="password"
            required
          />
          <InputField name="domain" label="Domain" placeholder="Enter domain" required />
          <InputSwitchField
            name="euRegion"
            label="EU Region"
            description="Enable the EU region setting if your domain is within the European Union."
          />
          <InputField
            name="fromEmail"
            label="Sender Email"
            type="email"
            placeholder="Enter email"
            required
          />
          <InputField name="fromName" label="Sender Name" placeholder="Enter name" />
          <InputField
            name="replyToEmail"
            label="Reply-to Email"
            type="email"
            placeholder="Enter email"
          />
          <InputField name="replyToName" label="Reply-to Name" placeholder="Enter name" />
        </>
      );

    case "sendgrid":
      return (
        <>
          <InputField
            name="apiKey"
            label="API Key"
            placeholder="Enter API key"
            type="password"
            required
          />
          <InputField
            name="fromEmail"
            label="Sender Email"
            type="email"
            placeholder="Enter email"
            required
          />
          <InputField name="fromName" label="Sender Name" placeholder="Enter name" />
          <InputField
            name="replyToEmail"
            label="Reply-to Email"
            type="email"
            placeholder="Enter email"
          />
          <InputField name="replyToName" label="Reply-to Name" placeholder="Enter name" />
        </>
      );

    case "smtp":
      return (
        <>
          <InputField name="smtpHost" label="Server host" placeholder="smtp.server.com" required />
          <InputField name="smtpPort" label="Server port" type="number" placeholder="587" />
          <InputField name="smtpUsername" label="Username" placeholder="Enter username" />
          <InputField
            name="smtpPassword"
            label="Password"
            type="password"
            placeholder="Enter password"
          />
          <InputSelectField
            name="smtpEncryption"
            label="Encryption"
            options={[
              { value: "tls", label: "TLS" },
              { value: "ssl", label: "SSL" },
              { value: "none", label: "None" },
            ]}
            portal={false}
          />
          <InputSwitchField
            name="autoTLS"
            label="Auto TLS"
            description="Automatically upgrade to TLS if supported by the server"
          />
          <InputField
            name="fromEmail"
            label="Sender email"
            type="email"
            placeholder="Enter email"
            required
          />
          <InputField name="fromName" label="Sender name" placeholder="Enter name" />
          <InputField
            name="replyToEmail"
            label="Reply-to email"
            type="email"
            placeholder="Enter email"
          />
          <InputField name="replyToName" label="Reply-to name" placeholder="Enter name" />
          <InputField name="xMailer" label="X-Mailer header" placeholder="" />
        </>
      );

    default:
      return null;
  }
};

export const CreateProviderTypeEmail = () => {
  const { values } = useFormikContext<EmailProviderFormData>();
  const providerType = values.providerType as ProviderName[MessagingProviderType.Email];

  return (
    <Column gap="8">
      <CardBox>
        <div className="space-y-4">
          <InputField name="name" label="Provider Name" placeholder="My Email Provider" required />

          <InputSelectField
            name="providerType"
            label="Provider Type"
            options={emailProviderOptions}
            portal={false}
            required
          />

          <CustomID label="Provider ID" name="providerId" />
          <InputSwitchField
            name="enabled"
            label="Enable Provider"
            description="Enable this provider for sending emails"
          />
        </div>
      </CardBox>
      <CardBox>
        <CardBoxTitle>Settings</CardBoxTitle>
        <CardBoxDesc>Set up the {providerType} credentials below.</CardBoxDesc>
        <div className="space-y-4 mt-5">{renderEmailProviderFields(providerType)}</div>
      </CardBox>
    </Column>
  );
};
