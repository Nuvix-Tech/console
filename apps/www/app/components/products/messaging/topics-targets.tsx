import { Column, Row, Text, Icon, Chip, Tag, Badge } from "@nuvix/ui/components";
import { DOCS_URL } from "~/lib/constants";

export const TopicsTargets = () => {
  const targetTypes = [
    {
      icon: "mail",
      label: "Email Addresses",
      description: "Send to verified email addresses",
    },
    {
      icon: "sms",
      label: "Phone Numbers",
      description: "SMS to verified phone numbers",
    },
    {
      icon: "push",
      label: "Device Tokens",
      description: "Push to registered devices",
    },
  ];

  const topicFeatures = [
    "Group targets by topic for mass messaging",
    "Users can subscribe to relevant topics",
    "Permission-based subscription control",
    "Send one message to thousands of users",
  ];

  return (
    <div className="w-full py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Column gap="8" className="mb-16 text-center max-w-3xl mx-auto">
          <Text variant="display-strong-xs" as="h2" onBackground="neutral-strong">
            Flexible Targeting with Topics & Targets
          </Text>
          <Text variant="body-default-m" onBackground="neutral-medium" as="p">
            Deliver messages to individual users or groups. Targets represent ways to reach a user,
            while topics let you broadcast to many users at once.
          </Text>
        </Column>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Targets Section */}
          <Column gap="l">
            <Column gap="m">
              <Text variant="heading-strong-m" as="h3" onBackground="neutral-strong">
                Targets
              </Text>
              <Text variant="body-default-m" onBackground="neutral-medium">
                A target is a specific communication channel for a user. Each user can have
                multiple targets - like two email addresses, a phone number, and multiple devices
                with your app installed.
              </Text>
            </Column>

            <Column gap="s">
              <Text variant="label-strong-s" onBackground="neutral-strong">
                Target Types
              </Text>
              <Column gap="xs">
                {targetTypes.map((type, idx) => (
                  <div
                    key={idx}
                    className="neutral-background-alpha-weak neutral-border-weak border rounded-xs p-4"
                  >
                    <Row gap="s" vertical="center">
                      <Icon name={type.icon} size="m" onBackground="neutral-medium" />
                      <Column gap="2">
                        <Text variant="label-strong-s" onBackground="neutral-strong">
                          {type.label}
                        </Text>
                        <Text variant="body-default-xs" onBackground="neutral-medium">
                          {type.description}
                        </Text>
                      </Column>
                    </Row>
                  </div>
                ))}
              </Column>
            </Column>

            <div data-theme="dark" className="page-background rounded-sm p-6">
              <Column gap="s">
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Example: Creating a target
                </Text>
                <pre className="text-sm neutral-on-background-medium font-mono leading-relaxed overflow-x-auto">
                  <code>{`const target = await nx.messaging.createTarget({
  targetId: 'unique-id',
  userId: 'user123',
  providerId: 'mailgun-provider',
  identifier: 'user@example.com',
  type: 'email'
});`}</code>
                </pre>
              </Column>
            </div>
          </Column>

          {/* Topics Section */}
          <Column gap="l">
            <Column gap="m">
              <Text variant="heading-strong-m" as="h3" onBackground="neutral-strong">
                Topics
              </Text>
              <Text variant="body-default-m" onBackground="neutral-medium">
                Topics are groups of targets. Create topics for different user segments or
                interests, then send a single message that reaches all subscribed targets at once.
              </Text>
            </Column>

            <Column gap="s">
              <Text variant="label-strong-s" onBackground="neutral-strong">
                Why Use Topics?
              </Text>
              <Column gap="xs">
                {topicFeatures.map((feature, idx) => (
                  <Row key={idx} gap="s" vertical="start">
                    <Icon
                      name="check"
                      size="s"
                      className="success-on-background-strong flex-shrink-0 mt-1"
                    />
                    <Text variant="body-default-s" onBackground="neutral-medium">
                      {feature}
                    </Text>
                  </Row>
                ))}
              </Column>
            </Column>

            <div data-theme="dark" className="page-background rounded-md p-6">
              <Column gap="s">
                <Text variant="label-strong-s" onBackground="neutral-medium">
                  Example: Sending to a topic
                </Text>
                <pre className="text-sm neutral-on-background-medium font-mono leading-relaxed overflow-x-auto">
                  <code>{`// Create a topic
const topic = await nx.messaging.createTopic({
  topicId: 'newsletters',
  name: 'Weekly Newsletter',
  subscribe: ['any'] // Who can subscribe
});

// Send to all subscribers
await nx.messaging.createEmail({
  topics: ['newsletters'],
  subject: 'This Week in Tech',
  content: '<h1>Latest Updates</h1>...'
});`}</code>
                </pre>
              </Column>
            </div>
          </Column>
        </div>

        {/* Learn More Section */}
        <div className="flex flex-wrap justify-center gap-4">
          <Badge id="targets" href={`${DOCS_URL}/products/messaging/targets`}>
            Learn more about Targets
          </Badge>
          <Badge id="topics" href={`${DOCS_URL}/products/messaging/topics`}>
            Learn more about Topics
          </Badge>
        </div>
      </div>
    </div>
  );
};
