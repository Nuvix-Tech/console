import { CustomID } from "@/components/_custom_id";
import { CardBox, CardBoxDesc, CardBoxTitle } from "@/components/others/card";
import { InputField, InputSwitchField, InputSelectField } from "@/components/others/forms";
import { Column } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React from "react";
import { PushProviderFormData, ProviderName } from "./_types";
import { MessagingProviderType } from "@nuvix/console";
import { EditorField } from "@/components/others/ui";

const pushProviderOptions = [
  { value: "fcm", label: "Firebase Cloud Messaging (FCM)" },
  { value: "apns", label: "Apple Push Notification Service (APNS)" },
];

export const CreateProviderTypePush = () => {
  const { values } = useFormikContext<PushProviderFormData>();
  const providerType = values.providerType as ProviderName[MessagingProviderType.Push];

  const renderProviderFields = () => {
    switch (providerType) {
      case "fcm":
        return (
          <>
            <EditorField
              name="serviceAccountJSON"
              language="json"
              helperText="Paste content of service account json file."
            />
          </>
        );

      case "apns":
        return (
          <>
            <InputField name="apnsTeamId" label="Team ID" placeholder="Enter team ID" required />
            <InputField
              name="apnsBundleId"
              label="Bundle ID"
              placeholder="Enter bundle ID"
              required
            />
            <InputField name="apnsKeyId" label="Authentication key ID" required />
            <EditorField
              name="apnsKey"
              label="Private Key"
              defaultValue="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
              required
            />
            <InputSwitchField
              name="apnsProduction"
              label="Production Environment"
              description="Use production APNS environment (disable for sandbox/development)"
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Column gap="8">
      <CardBox>
        <div className="space-y-4">
          <InputField name="name" label="Provider Name" placeholder="My Push Provider" required />

          <InputSelectField
            name="providerType"
            label="Provider Type"
            options={pushProviderOptions}
            required
          />

          <CustomID label="Provider ID" name="providerId" />

          <InputSwitchField
            name="enabled"
            label="Enable Provider"
            description="Enable this provider for sending push notifications"
          />
        </div>
      </CardBox>
      <CardBox>
        <CardBoxTitle>Settings</CardBoxTitle>
        <CardBoxDesc>Set up the {providerType} credentials below.</CardBoxDesc>
        <div className="space-y-4 mt-5">{renderProviderFields()}</div>
      </CardBox>
    </Column>
  );
};
