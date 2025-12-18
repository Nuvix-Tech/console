"use client";

import { useState } from "react";
import { Column, Row, Text, Icon, Chip } from "@nuvix/ui/components";
import { motion, AnimatePresence } from "motion/react";

type SchemaType = "document" | "managed" | "unmanaged";

interface SchemaInfo {
  id: SchemaType;
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
}

const schemas: SchemaInfo[] = [
  {
    id: "document",
    name: "Document Schema",
    tagline: "NoSQL Simplicity",
    description:
      "A NoSQL-style abstraction over PostgreSQL. No SQL required - just JSON documents, collections, and REST APIs for rapid development.",
    icon: "document",
    color: "purple",
    features: [
      "NoSQL interface with JSON documents",
      "Collection-based data organization",
      "Rich query operators & filters",
      "ACL permissions at collection level",
      "Read-only SQL access available",
    ],
    codeExample: {
      title: "Creating a document",
      code: `POST /v1/schemas/main/collections/users/documents

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "role": "developer",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}`,
    },
    useCases: [
      "Rapid prototyping",
      "Dynamic data models",
      "Mobile & web backends",
      "Content management",
    ],
  },
  {
    id: "managed",
    name: "Managed Schema",
    tagline: "SQL + Automation",
    description:
      "Full PostgreSQL power with automatic security. Get Row Level Security policies, permission tables, and API generation - all automated so you can focus on building.",
    icon: "database",
    color: "teal",
    features: [
      "Complete SQL support",
      "Automatic RLS policy generation",
      "Auto-created permission tables",
      "DDL triggers for governance",
      "Automatic _id column per table",
    ],
    codeExample: {
      title: "SQL + automatic security",
      code: `CREATE TABLE products (
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  category TEXT
);

-- Nuvix automatically creates:
-- - products_perms table
-- - RLS policies (SELECT, INSERT, UPDATE, DELETE)
-- - REST API at /v1/schemas/main/tables/products`,
    },
    useCases: [
      "Production applications",
      "Multi-tenant systems",
      "Enterprise apps",
      "Structured data governance",
    ],
  },
  {
    id: "unmanaged",
    name: "Unmanaged Schema",
    tagline: "Complete Control",
    description:
      "Raw PostgreSQL exposed through the Nuvix API. Perfect for legacy migrations, complex workloads, and custom governance systems where you need total control.",
    icon: "settings",
    color: "orange",
    features: [
      "Full PostgreSQL control",
      "Manual RLS & permission setup",
      "Custom constraints & indexes",
      "Legacy database compatibility",
      "Advanced SQL workloads",
    ],
    codeExample: {
      title: "Custom PostgreSQL schema",
      code: `CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full control over:
-- - Custom RLS policies
-- - Triggers and functions
-- - Indexes and constraints`,
    },
    useCases: [
      "Legacy migrations",
      "Advanced SQL scenarios",
      "Custom governance",
      "Complex relationships",
    ],
  },
];

export const SchemaExplorer = () => {
  const [activeSchema, setActiveSchema] = useState<SchemaType>("managed");

  const active = schemas.find((s) => s.id === activeSchema)!;

  return (
    <div className="w-full py-32 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <Column gap="8" className="mb-16 text-center max-w-3xl mx-auto">
          <Text variant="display-strong-xs" as="h2" onBackground="neutral-strong">
            One Database. Three Architectures.
          </Text>
          <Text variant="body-default-m" onBackground="neutral-medium" as="p">
            Choose the level of abstraction and control that fits your needs. From NoSQL simplicity
            to full PostgreSQL power - all in one unified platform.
          </Text>
        </Column>

        {/* Schema Type Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {schemas.map((schema) => (
            <button
              key={schema.id}
              onClick={() => setActiveSchema(schema.id)}
              className={`
                px-6 py-4 rounded-xs border-2 transition-all duration-300
                ${
                  activeSchema === schema.id
                    ? "brand-border-strong brand-background-alpha-weak scale-105"
                    : "neutral-border-medium neutral-background-alpha-weak hover:border-neutral-alpha-strong hover:bg-neutral-alpha-medium"
                }
              `}
            >
              <Row gap="s" vertical="center">
                <Icon
                  name={schema.icon}
                  size="m"
                  className={
                    activeSchema === schema.id ? "brand-on-solid-weak" : "neutral-on-solid-strong"
                  }
                />
                <Column gap="2">
                  <Text
                    variant="label-strong-s"
                    onBackground={activeSchema === schema.id ? "brand-strong" : "neutral-strong"}
                  >
                    {schema.name}
                  </Text>
                  <Text variant="label-default-xs" onBackground="neutral-medium">
                    {schema.tagline}
                  </Text>
                </Column>
              </Row>
            </button>
          ))}
        </div>

        {/* Active Schema Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSchema}
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
            </Column>

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
