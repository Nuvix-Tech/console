import { CustomID } from "@/components/_custom_id";
import { CardBox } from "@/components/others/card";
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
    const { values, setFieldValue } = useFormikContext<SmsProviderFormData>();

    const renderProviderFields = () => {
        const providerType = values.providerType as ProviderName[MessagingProviderType.Sms];

        switch (providerType) {
            case "twilio":
                return (
                    <>
                        <InputField name="accountSid" label="Account SID" type="password" required />
                        <InputField name="authToken" label="Auth Token" type="password" required />
                        <InputField name="from" label="From Number" placeholder="+1234567890" required />
                    </>
                );

            case "msg91":
                return (
                    <>
                        <InputField name="msg91ApiKey" label="API Key" type="password" required />
                        <InputField name="msg91SenderId" label="Sender ID" placeholder="MSGIND" required />
                        <InputField name="msg91Route" label="Route" placeholder="4" required />
                    </>
                );

            case "telesign":
                return (
                    <>
                        <InputField name="telesignCustomerId" label="Customer ID" required />
                        <InputField name="telesignApiKey" label="API Key" type="password" required />
                    </>
                );

            case "textmagic":
                return (
                    <>
                        <InputField name="textmagicUsername" label="Username" required />
                        <InputField name="textmagicApiKey" label="API Key" type="password" required />
                    </>
                );

            case "vonage":
                return (
                    <>
                        <InputField name="vonageApiKey" label="API Key" type="password" required />
                        <InputField name="vonageApiSecret" label="API Secret" type="password" required />
                        <InputField name="vonageFrom" label="From Number" placeholder="+1234567890" required />
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
                    <InputField name="name" label="Provider Name" placeholder="My SMS Provider" required />

                    <InputSelectField
                        name="providerType"
                        label="Provider Type"
                        options={smsProviderOptions}
                        required
                    />

                    <CustomID label="Provider ID" name="providerId" />

                    {renderProviderFields()}

                    <InputSwitchField
                        name="enabled"
                        label="Enable Provider"
                        description="Enable this provider for sending SMS messages"
                    />
                </div>
            </CardBox>
        </Column>
    );
};
