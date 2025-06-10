// Field mapping configurations for each provider

const fieldMappings: Record<string, Record<string, string>> = {
    mailgun: {
        apiKey: "apiKey",
        domain: "domain",
        isEuRegion: "euRegion",
        fromName: "fromName",
        fromEmail: "fromEmail",
        replyToEmail: "replyToEmail",
        replyToName: "replyToName",
    },
    sendgrid: {
        apiKey: "apiKey",
        fromName: "fromName",
        fromEmail: "fromEmail",
        replyToEmail: "replyToEmail",
        replyToName: "replyToName",
    },
    smtp: {
        host: "smtpHost",
        port: "smtpPort",
        username: "smtpUsername",
        password: "smtpPassword",
        encryption: "smtpEncryption",
        autoTLS: "autoTLS",
        fromName: "fromName",
        fromEmail: "fromEmail",
        replyToEmail: "replyToEmail",
        replyToName: "replyToName",
        mailer: "xMailer",
    },
    twilio: {
        accountSid: "accountSid",
        authToken: "authToken",
        from: "from",
    },
    msg91: {
        authKey: "msg91AuthKey",
        senderId: "msg91SenderId",
        templateId: "msg91TemplateId",
    },
    telesign: {
        customerId: "telesignCustomerId",
        apiKey: "telesignApiKey",
        from: "telesignFrom",
    },
    textmagic: {
        username: "textmagicUsername",
        apiKey: "textmagicApiKey",
        from: "textmagicFrom",
    },
    vonage: {
        apiKey: "vonageApiKey",
        apiSecret: "vonageApiSecret",
        from: "vonageFrom",
    },
    fcm: {
        serviceAccountJSON: "serviceAccountJSON",
    },
    apns: {
        authKeyId: "apnsKeyId",
        teamId: "apnsTeamId",
        bundleId: "apnsBundleId",
        authKey: "apnsKey",
        sandbox: "apnsProduction",
    },
};

// Utility function to transform data to schema format
export const transformDataToSchema = (data: Record<string, any>, providerType: string): Record<string, any> => {
    const mapping = fieldMappings[providerType];
    if (!mapping) {
        return { ...data, providerType };
    }

    const transformedData: Record<string, any> = { providerType };
    
    Object.entries(data).forEach(([key, value]) => {
        const schemaKey = mapping[key] || key;
        if (value !== undefined && value !== null) {
            transformedData[schemaKey] = value;
        }
    });

    return transformedData;
};

// Utility function to transform schema format back to data format
export const transformSchemaToData = (schemaData: Record<string, any>, providerType: string): Record<string, any> => {
    const mapping = fieldMappings[providerType];
    if (!mapping) {
        const { providerType: _, ...rest } = schemaData;
        return rest;
    }

    const reverseMapping = Object.fromEntries(
        Object.entries(mapping).map(([key, value]) => [value, key])
    );

    const transformedData: Record<string, any> = {};
    
    Object.entries(schemaData).forEach(([key, value]) => {
        if (key === 'providerType') return;
        
        const dataKey = reverseMapping[key] || key;
        if (value !== undefined && value !== null) {
            transformedData[dataKey] = value;
        }
    });

    return transformedData;
};
