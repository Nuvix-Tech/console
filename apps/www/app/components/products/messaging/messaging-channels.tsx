"use client";

import { useState } from "react";
import { Column, Row, Text, Icon, Chip } from "@nuvix/ui/components";
import { motion, AnimatePresence } from "motion/react";

type ChannelType = "email" | "sms" | "push";

interface ChannelInfo {
    id: ChannelType;
    name: string;
    tagline: string;
    description: string;
    icon: string;
    color: string;
    features: string[];
    codeExample: {
        title: string;
        code: string;
    };
    useCases: string[];
    providers: string[];
}

const channels: ChannelInfo[] = [
    {
        id: "email",
        name: "Email Messages",
        tagline: "Rich HTML Content",
        description:
            "Send customized HTML email messages to your users. Perfect for newsletters, invoices, promotions, and transactional emails with full styling and formatting control.",
        icon: "mail",
        color: "blue",
        features: [
            "Rich HTML email templates",
            "Custom sender name and address",
            "Attachment support",
            "Scheduled delivery",
            "Delivery tracking and analytics",
        ],
        codeExample: {
            title: "Sending an email message",
            code: `const message = await nx.messaging.createEmail({
  messageId: 'welcome-email',
  subject: 'Welcome to Our Platform!',
  content: '<h1>Welcome!</h1><p>Thanks for joining us.</p>',
  topics: ['new-users'],
  // Or target specific users
  users: ['user123']
});`,
        },
        useCases: [
            "Welcome emails",
            "Order confirmations",
            "Marketing campaigns",
            "Password resets",
            "Newsletters",
        ],
        providers: ["Mailgun", "SendGrid", "SMTP"],
    },
    {
        id: "sms",
        name: "SMS Messages",
        tagline: "Direct Text Alerts",
        description:
            "Send text messages directly to your users' phones. Ideal for time-sensitive alerts, OTP codes, order updates, and notifications that need immediate attention.",
        icon: "sms",
        color: "green",
        features: [
            "Global SMS delivery",
            "160-character optimized",
            "Unicode support for emojis",
            "Delivery status tracking",
            "OTP and verification codes",
        ],
        codeExample: {
            title: "Sending an SMS message",
            code: `const message = await nx.messaging.createSms({
  messageId: 'order-update',
  content: 'Your order #12345 has shipped! Track: https://...',
  topics: ['premium-customers'],
  // Or target specific phone numbers
  targets: ['target-phone-id']
});`,
        },
        useCases: [
            "Two-factor authentication",
            "Order status updates",
            "Appointment reminders",
            "Security alerts",
            "Time-sensitive notifications",
        ],
        providers: ["Twilio", "MSG91", "Telesign", "Textmagic", "Vonage"],
    },
    {
        id: "push",
        name: "Push Notifications",
        tagline: "Real-time Device Alerts",
        description:
            "Send push notifications to user devices instantly. Appear in notification centers on mobile and web apps, keeping users engaged even when your app is closed.",
        icon: "push",
        color: "purple",
        features: [
            "Cross-platform support (iOS, Android, Web)",
            "Rich media notifications",
            "Action buttons and deep links",
            "Silent background updates",
            "Badge count management",
        ],
        codeExample: {
            title: "Sending a push notification",
            code: `const message = await nx.messaging.createPush({
  messageId: 'new-message-alert',
  title: 'New Message',
  body: 'You have a new message from Sarah',
  data: { chatId: 'chat-456' },
  topics: ['mobile-users'],
  // Optional: custom actions
  action: 'VIEW_CHAT'
});`,
        },
        useCases: [
            "Chat messages",
            "Breaking news alerts",
            "In-app promotions",
            "Social notifications",
            "Game events",
        ],
        providers: ["FCM (Firebase)", "APNS (Apple)"],
    },
];

export const MessagingChannels = () => {
    const [activeChannel, setActiveChannel] = useState<ChannelType>("email");

    const active = channels.find((c) => c.id === activeChannel)!;

    return (
        <div className="w-full py-32 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6">
                <Column gap="8" className="mb-16 text-center max-w-3xl mx-auto">
                    <Text variant="display-strong-xs" as="h2" onBackground="neutral-strong">
                        Reach Users Across Every Channel
                    </Text>
                    <Text variant="body-default-m" onBackground="neutral-medium" as="p">
                        Send messages through email, SMS, or push notifications. Choose the right channel for
                        your message and audience - all from one unified messaging platform.
                    </Text>
                </Column>

                {/* Channel Type Selector */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {channels.map((channel) => (
                        <button
                            key={channel.id}
                            onClick={() => setActiveChannel(channel.id)}
                            className={`
                px-6 py-4 rounded-xs border-2 transition-all duration-300
                ${activeChannel === channel.id
                                    ? "brand-border-strong brand-background-alpha-weak scale-105"
                                    : "neutral-border-medium neutral-background-alpha-weak hover:border-neutral-alpha-strong hover:bg-neutral-alpha-medium"
                                }
              `}
                        >
                            <Row gap="s" vertical="center">
                                <Icon
                                    name={channel.icon}
                                    size="m"
                                    className={
                                        activeChannel === channel.id ? "brand-on-solid-weak" : "neutral-on-solid-strong"
                                    }
                                />
                                <Column gap="2">
                                    <Text
                                        variant="label-strong-s"
                                        onBackground={activeChannel === channel.id ? "brand-strong" : "neutral-strong"}
                                    >
                                        {channel.name}
                                    </Text>
                                    <Text variant="label-default-xs" onBackground="neutral-medium">
                                        {channel.tagline}
                                    </Text>
                                </Column>
                            </Row>
                        </button>
                    ))}
                </div>

                {/* Active Channel Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeChannel}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
                    >
                        {/* Left: Features & Info */}
                        <Column gap="l">
                            <Column gap="m">
                                <Text variant="heading-strong-m" as="h3" onBackground="neutral-strong">
                                    {active.name}
                                </Text>
                                <Text variant="body-default-m" onBackground="neutral-medium">
                                    {active.description}
                                </Text>
                            </Column>

                            <Column gap="s">
                                <Text variant="label-strong-s" onBackground="neutral-strong">
                                    Key Features
                                </Text>
                                <Column gap="xs">
                                    {active.features.map((feature, idx) => (
                                        <Row key={idx} gap="s" vertical="start">
                                            <Icon
                                                name="check"
                                                size="s"
                                                className="success-on-solid-strong flex-shrink-0 mt-1"
                                            />
                                            <Text variant="body-default-s" onBackground="neutral-medium">
                                                {feature}
                                            </Text>
                                        </Row>
                                    ))}
                                </Column>
                            </Column>

                            <Column gap="s">
                                <Text variant="label-strong-s" onBackground="neutral-strong">
                                    Common Use Cases
                                </Text>
                                <div className="flex flex-wrap gap-2">
                                    {active.useCases.map((useCase, idx) => (
                                        <Chip
                                            key={idx}
                                            label={useCase}
                                            selected={false}
                                            as="span"
                                            className="!text-(--neutral-on-background-medium)"
                                        />
                                    ))}
                                </div>
                            </Column>

                            <Column gap="s">
                                <Text variant="label-strong-s" onBackground="neutral-strong">
                                    Supported Providers
                                </Text>
                                <div className="flex flex-wrap gap-2">
                                    {active.providers.map((provider, idx) => (
                                        <Chip
                                            key={idx}
                                            label={provider}
                                            selected={false}
                                            as="span"
                                            className="!text-(--neutral-on-background-medium)"
                                        />
                                    ))}
                                </div>
                            </Column>
                        </Column>

                        {/* Right: Code Example */}
                        <Column gap="s">
                            <Text variant="label-strong-s" onBackground="neutral-medium">
                                {active.codeExample.title}
                            </Text>
                            <div className="neutral-background-alpha-medium rounded-md p-6 overflow-x-auto">
                                <pre className="text-sm neutral-on-solid-weak font-mono leading-relaxed">
                                    <code>{active.codeExample.code}</code>
                                </pre>
                            </div>
                        </Column>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
