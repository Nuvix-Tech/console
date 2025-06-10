import { CustomID } from "@/components/_custom_id";
import { CardBox } from "@/components/others/card";
import { InputField, InputSwitchField, InputSelectField, InputTextareaField } from "@/components/others/forms";
import { Column } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React from "react";
import { PushProviderFormData, ProviderName } from "./_types";
import { MessagingProviderType } from "@nuvix/console";

const pushProviderOptions = [
    { value: "fcm", label: "Firebase Cloud Messaging (FCM)" },
    { value: "apns", label: "Apple Push Notification Service (APNS)" },
];

export const CreateProviderTypePush = () => {
    const { values, setFieldValue } = useFormikContext<PushProviderFormData>();

    const renderProviderFields = () => {
        const providerType = values.providerType as ProviderName[MessagingProviderType.Push];

        switch (providerType) {
            case "fcm":
                return (
                    <>
                        <InputField name="fcmServerKey" label="Server Key" type="password" required />
                        <InputField name="fcmSenderId" label="Sender ID" required />
                        <InputField name="fcmProjectId" label="Project ID" required />
                    </>
                );

            case "apns":
                return (
                    <>
                        <InputField name="apnsKeyId" label="Key ID" required />
                        <InputField name="apnsTeamId" label="Team ID" required />
                        <InputField name="apnsBundleId" label="Bundle ID" placeholder="com.example.app" required />
                        <InputTextareaField
                            name="apnsKey"
                            label="Private Key"
                            placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                            lines={5}
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
        <Column>
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

                    {renderProviderFields()}

                    <InputSwitchField
                        name="enabled"
                        label="Enable Provider"
                        description="Enable this provider for sending push notifications"
                    />
                </div>
            </CardBox>
        </Column>
    );
};
