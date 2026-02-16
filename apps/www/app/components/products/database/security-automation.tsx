import { Column, Row, Text, Icon } from "@nuvix/ui/components";
import { motion } from "motion/react";

const automationFeatures = [
  {
    title: "Automatic Row Level Security",
    description:
      "Managed schemas generate RLS policies automatically for every table. CRUD operations are secured by default with policies that enforce access control at the row level.",
    icon: "lock",
    highlight: "Auto-generated CRUD policies",
  },
  {
    title: "Permission Table Generation",
    description:
      "Every table gets an automatic [table]_perms permission table. Define granular access controls without manual setup—Nuvix handles the infrastructure.",
    icon: "key",
    highlight: "Zero-config permission system",
  },
  {
    title: "DDL Trigger Automation",
    description:
      "Database triggers automatically update policies when you modify your schema. Add a table, get instant security—no manual policy writing required.",
    icon: "automation",
    highlight: "Self-maintaining security",
  },
  {
    title: "Multi-Tenant Architecture",
    description:
      "Schema isolation ensures clean separation between tenants. Each schema operates independently with its own security policies and access controls.",
    icon: "team",
    highlight: "Built-in tenant isolation",
  },
];

export const SecurityAutomation = () => {
  return (
    <div className="w-full py-32 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <Column gap="8" className="mb-20 text-center max-w-3xl mx-auto">
          <Text variant="display-strong-xs" as="h2">
            Security on Autopilot
          </Text>
          <Text variant="body-default-m" onBackground="neutral-medium" as="p">
            Managed schemas handle security complexity for you. Get automatic Row Level Security,
            permission tables, and governance policies - so you can focus on building features, not
            managing infrastructure.
          </Text>
        </Column>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {automationFeatures.map((feature, index) => (
            <AutomationCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              highlight={feature.highlight}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* ACL for Document Schemas */}
        <motion.div
          data-theme="dark"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-lg border neutral-border-strong page-background"
        >
          <Row gap="l" vertical="start" className="flex-col lg:flex-row">
            <Icon name="document" size="l" onBackground="neutral-medium" />
            <Column gap="m" className="flex-1">
              <Text variant="heading-strong-m" as="h3" onBackground="neutral-medium">
                ACL Permissions for Document Schemas
              </Text>
              <Text variant="body-default-m" onBackground="neutral-medium">
                Document schemas use Access Control Lists (ACLs) at the collection and document
                level. Define read, write, update, and delete permissions with granular control - no
                SQL required.
              </Text>
              <Row gap="s" className="flex-wrap">
                <div className="px-3 py-1 rounded-full brand-background-alpha-medium brand-on-background-strong">
                  <Text variant="label-default-xs">Collection-level access</Text>
                </div>
                <div className="px-3 py-1 rounded-full brand-background-alpha-medium brand-on-background-strong">
                  <Text variant="label-default-xs">Document-level access</Text>
                </div>
                <div className="px-3 py-1 rounded-full brand-background-alpha-medium brand-on-background-strong">
                  <Text variant="label-default-xs">API-driven permissions</Text>
                </div>
              </Row>
            </Column>
          </Row>
        </motion.div>

        {/* Custom Policies Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Text variant="body-default-s" onBackground="neutral-medium">
            Need custom logic? Managed schemas support custom RLS policies and triggers alongside
            automated security.
          </Text>
        </motion.div>
      </div>
    </div>
  );
};

interface AutomationCardProps {
  title: string;
  description: string;
  icon: string;
  highlight: string;
  delay: number;
}

const AutomationCard = ({ title, description, icon, highlight, delay }: AutomationCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="group"
  >
    <Column
      gap="12"
      className="h-full p-6 rounded-xl neutral-background-alpha-weak border neutral-border-weak transition-all duration-300"
    >
      <Row gap="12" vertical="start">
        <Column gap="4" className="flex-1">
          <Text variant="heading-strong-s" as="h3">
            {title}
          </Text>
          <div className="px-2 py-0.5 rounded success-background-alpha-medium w-fit">
            <Text variant="label-default-s" className="success-on-background-strong">
              {highlight}
            </Text>
          </div>
        </Column>
      </Row>
      <Text variant="body-default-s" onBackground="neutral-medium" as="p">
        {description}
      </Text>
    </Column>
  </motion.div>
);
