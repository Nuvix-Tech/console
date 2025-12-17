"use client";

import { Column, Row, Text, Icon } from "@nuvix/ui/components";
import { Banknote, ChartBar, Globe2 } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    title: "Enterprise-Grade Reliability",
    description:
      "ACID compliance, proven stability, and battle-tested performance. Trusted by financial systems and global platforms.",
    icon: "shield-check",
  },
  {
    title: "Advanced SQL Capabilities",
    description:
      "Full PostgreSQL feature set including complex joins, CTEs, window functions, and sophisticated query planning.",
    icon: "code",
  },
  {
    title: "Battle-Tested at Scale",
    description:
      "Powers high-traffic applications worldwide. From startups to Fortune 500s, PostgreSQL scales with your needs.",
    icon: "chart",
  },
  {
    title: "Rich Data Types & Extensions",
    description:
      "JSON, arrays, geometric types, full-text search, and more. Extend functionality with custom types and functions.",
    icon: "database",
  },
];

export const PostgresFoundation = () => {
  return (
    <div className="w-full py-32 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <Column gap="8" className="mb-20 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <Text variant="display-strong-xs" as="h2">
              Built on PostgreSQL
            </Text>
          </div>
          <Text variant="body-default-m" onBackground="neutral-medium" as="p">
            Every Nuvix project runs on a fully managed PostgreSQL instance. Get the world's most
            advanced open-source database with enterprise reliability, powerful features, and proven
            performance.
          </Text>
        </Column>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Column gap="m">
            <Text variant="label-strong-s" onBackground="neutral-medium">
              Trusted by industry leaders in
            </Text>
            <div className="flex flex-wrap justify-center gap-6 text-neutral-on-background-medium">
              <Row gap="xs" vertical="center">
                <Icon name={Banknote} size="s" />
                <Text variant="body-default-s">Financial Systems</Text>
              </Row>
              <Row gap="xs" vertical="center">
                <Icon name={Globe2} size="s" />
                <Text variant="body-default-s">Global Commerce</Text>
              </Row>
              <Row gap="xs" vertical="center">
                <Icon name={ChartBar} size="s" />
                <Text variant="body-default-s">High-Scale Platforms</Text>
              </Row>
            </div>
          </Column>
        </motion.div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ title, description, delay }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="group p-6 rounded-lg border neutral-border-medium neutral-background-alpha-weak transition-all duration-300"
  >
    <Row gap="m" vertical="start">
      <Column gap="s">
        <Text variant="heading-strong-s" as="h3">
          {title}
        </Text>
        <Text variant="body-default-s" onBackground="neutral-medium" as="p">
          {description}
        </Text>
      </Column>
    </Row>
  </motion.div>
);
