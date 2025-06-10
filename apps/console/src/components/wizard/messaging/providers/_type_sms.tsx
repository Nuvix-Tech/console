import { CustomID } from "@/components/_custom_id";
import { CardBox, CardBoxDesc, CardBoxTitle } from "@/components/others/card";
import { InputField, InputSwitchField, InputSelectField } from "@/components/others/forms";
import { Column } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React from "react";
import { SmsProviderFormData, ProviderName } from "./_types";
import { MessagingProviderType } from "@nuvix/console";

const smsProviderOptions = [
    { value: "twilio", label: "Twilio" },
    { value: "msg91", label: "MSG91" },
    { value: "telesign", label: "Telesign" },
    { value: "textmagic", label: "Textmagic" },
    { value: "vonage", label: "Vonage" },
];

export const CreateProviderTypeSms = () => {
    const { values } = useFormikContext<SmsProviderFormData>();
    const providerType = values.providerType as ProviderName[MessagingProviderType.Sms];

    const renderProviderFields = () => {

        switch (providerType) {
            case "twilio":
                return (
                    <>
                        <InputField name="accountSid" label="Account SID" type="password" required />
                        <InputField name="authToken" label="Auth Token" type="password" required />
                        <InputField name="from" label="Sender Number" placeholder="+1234567890" required />
                    </>
                );

            case "msg91":
                return (
                    <>
                        <InputField name="msg91AuthKey" label="Auth Key" type="password" placeholder="Enter auth key" required />
                        <InputField name="msg91SenderId" label="Sender ID" placeholder="Enter sender ID" required />
                        <InputField name="msg91TemplateId" label="Template ID" required />
                    </>
                );

            case "telesign":
                return (
                    <>
                        <InputField name="telesignCustomerId" label="Customer ID" placeholder="Enter customer ID" required />
                        <InputField name="telesignApiKey" label="API Key" type="password" placeholder="Enter API key" required />
                        <InputField name="telesignFrom" label="Sender Number" placeholder="+1234567890" required />
                    </>
                );

            case "textmagic":
                return (
                    <>
                        <InputField name="textmagicUsername" label="Username" placeholder="Enter username" required />
                        <InputField name="textmagicApiKey" label="API Key" type="password" placeholder="Enter API key" required />
                        <InputField name="textmagicFrom" label="Sender Number" placeholder="+1234567890" required />
                    </>
                );

            case "vonage":
                return (
                    <>
                        <InputField name="vonageApiKey" label="API Key" type="password" placeholder="Enter API key" required />
                        <InputField name="vonageApiSecret" label="API Secret" type="password" placeholder="Enter API secret" required />
                        <InputField name="vonageFrom" label="Sender Number" placeholder="+1234567890" required />
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
                    <InputField name="name" label="Provider Name" placeholder="My SMS Provider" required />

                    <InputSelectField
                        name="providerType"
                        label="Provider Type"
                        options={smsProviderOptions}
                        required
                    />

                    <CustomID label="Provider ID" name="providerId" />

                    <InputSwitchField
                        name="enabled"
                        label="Enable Provider"
                        description="Enable this provider for sending SMS messages"
                    />
                </div>
            </CardBox>
            <CardBox>
                <CardBoxTitle>
                    Settings
                </CardBoxTitle>
                <CardBoxDesc>
                    Set up the {providerType} credentials below.
                </CardBoxDesc>
                <div className="space-y-4 mt-5">
                    {renderProviderFields()}
                </div>
            </CardBox>
        </Column>
    );
};
