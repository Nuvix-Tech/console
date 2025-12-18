import { Column, Row, Text, Icon, Card } from "@nuvix/ui/components";
import { DOCS_URL } from "~/lib/constants";

const providers = {
  email: [
    {
      name: "Mailgun",
      icon: "mail",
      description: "Powerful email delivery service with detailed analytics",
      href: `${DOCS_URL}/products/messaging/mailgun`,
    },
    {
      name: "SendGrid",
      icon: "send",
      description: "Reliable email infrastructure for transactional and marketing emails",
      href: `${DOCS_URL}/products/messaging/sendgrid`,
    },
    {
      name: "SMTP",
      icon: "mail",
      description: "Connect any SMTP server with standard authentication",
      href: `${DOCS_URL}/products/messaging/smtp`,
    },
  ],
  sms: [
    {
      name: "Twilio",
      icon: "message-circle",
      description: "Industry-leading SMS platform with global reach",
      href: `${DOCS_URL}/products/messaging/twilio`,
    },
    {
      name: "MSG91",
      icon: "message-square",
      description: "Enterprise SMS gateway for bulk messaging",
      href: `${DOCS_URL}/products/messaging/msg91`,
    },
    {
      name: "Telesign",
      icon: "shield",
      description: "Secure SMS delivery with fraud prevention",
      href: `${DOCS_URL}/products/messaging/telesign`,
    },
    {
      name: "Textmagic",
      icon: "message-circle",
      description: "Simple SMS messaging with two-way communication",
      href: `${DOCS_URL}/products/messaging/textmagic`,
    },
    {
      name: "Vonage",
      icon: "phone",
      description: "Global SMS delivery with programmable APIs",
      href: `${DOCS_URL}/products/messaging/vonage`,
    },
  ],
  push: [
    {
      name: "FCM",
      icon: "smartphone",
      description: "Firebase Cloud Messaging for Android, iOS, and Web",
      href: `${DOCS_URL}/products/messaging/fcm`,
    },
    {
      name: "APNS",
      icon: "smartphone",
      description: "Apple Push Notification service for iOS and macOS",
      href: `${DOCS_URL}/products/messaging/apns`,
    },
  ],
};

export const ProviderShowcase = () => {
  return (
    <div className="w-full py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Column gap="8" className="mb-16 text-center max-w-3xl mx-auto">
          <Text variant="display-strong-xs" as="h2" onBackground="neutral-strong">
            Connect Your Favorite Providers
          </Text>
          <Text variant="body-default-m" onBackground="neutral-medium" as="p">
            Nuvix integrates with industry-leading messaging providers. Choose the services that
            work best for your needs and switch between them seamlessly.
          </Text>
        </Column>

        {/* Email Providers */}
        <Column gap="l" className="mb-12">
          <Row gap="s" vertical="center">
            <Icon name="mail" size="m" onBackground="neutral-strong" />
            <Text variant="heading-strong-m" as="h3" onBackground="neutral-strong">
              Email Providers
            </Text>
          </Row>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {providers.email.map((provider) => (
              <a
                key={provider.name}
                href={provider.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="neutral-background-alpha-weak neutral-border-medium border-2 rounded-md p-6 transition-all duration-300 hover:border-neutral-alpha-strong hover:bg-neutral-alpha-medium h-full">
                  <Column gap="s">
                    <Text variant="label-strong-m" onBackground="neutral-strong">
                      {provider.name}
                    </Text>
                    <Text variant="body-default-s" onBackground="neutral-medium">
                      {provider.description}
                    </Text>
                  </Column>
                </div>
              </a>
            ))}
          </div>
        </Column>

        {/* SMS Providers */}
        <Column gap="l" className="mb-12">
          <Row gap="s" vertical="center">
            <Icon name="sms" size="m" onBackground="neutral-strong" />
            <Text variant="heading-strong-m" as="h3" onBackground="neutral-strong">
              SMS Providers
            </Text>
          </Row>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {providers.sms.map((provider) => (
              <a
                key={provider.name}
                href={provider.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="neutral-background-alpha-weak neutral-border-medium border-2 rounded-md p-6 transition-all duration-300 hover:border-neutral-alpha-strong hover:bg-neutral-alpha-medium h-full">
                  <Column gap="s">
                    <Text variant="label-strong-m" onBackground="neutral-strong">
                      {provider.name}
                    </Text>
                    <Text variant="body-default-s" onBackground="neutral-medium">
                      {provider.description}
                    </Text>
                  </Column>
                </div>
              </a>
            ))}
          </div>
        </Column>

        {/* Push Notification Providers */}
        <Column gap="l">
          <Row gap="s" vertical="center">
            <Icon name="push" size="m" onBackground="neutral-strong" />
            <Text variant="heading-strong-m" as="h3" onBackground="neutral-strong">
              Push Notification Providers
            </Text>
          </Row>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {providers.push.map((provider) => (
              <a
                key={provider.name}
                href={provider.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="neutral-background-alpha-weak neutral-border-medium border-2 rounded-md p-6 transition-all duration-300 hover:border-neutral-alpha-strong hover:bg-neutral-alpha-medium h-full">
                  <Column gap="s">
                    <Text variant="label-strong-m" onBackground="neutral-strong">
                      {provider.name}
                    </Text>
                    <Text variant="body-default-s" onBackground="neutral-medium">
                      {provider.description}
                    </Text>
                  </Column>
                </div>
              </a>
            ))}
          </div>
        </Column>
      </div>
    </div>
  );
};
