import { SmartImage, Text } from "@nuvix/ui/components";
import { motion } from "motion/react";

export const SchemasSection = () => {
  return (
    <section className="py-12 container mx-auto flex flex-col my-16 px-4 gap-20">
      <div className="flex flex-col justify-center">
        <Text className="text-center" variant="display-strong-xs" as="h2">
          <span className="neutral-on-background-medium">Schema Management,</span> Reimagined
        </Text>
        <Text
          className="text-center max-w-2xl mx-auto"
          variant="body-default-l"
          onBackground="neutral-weak"
        >
          From startup speed to enterprise control, Nuvix adapts to how you build.
        </Text>
      </div>

      {/* Visual Table Editor */}
      <div className="mt-8 flex justify-between gap-4">
        <div className="flex flex-col gap-4 max-w-lg">
          <Text variant="heading-strong-xl" as="h3">
            Visual Table Editor
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Model your data visually with an intuitive editor. Add, edit, and connect tables in
            seconds— no SQL required. Nuvix automatically optimizes relationships and keeps your
            schema consistent.
          </Text>
          {[
            "Design tables and relationships visually.",
            "Add and edit fields with built-in type safety.",
            "Auto-generate indexes and constraints.",
            "Import/export seamlessly with CSV, JSON, or SQL.",
          ].map((point) => (
            <div key={point} className="flex items-start gap-2">
              <motion.div
                className="w-2 h-2 brand-background-alpha-medium rounded-full mt-2 flex-shrink-0"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <Text variant="body-default-m" onBackground="neutral-medium">
                {point}
              </Text>
            </div>
          ))}
        </div>
        <div className="max-w-3xl rounded relative">
          <div
            className="brand-solid-medium w-full h-full radius-s relative shadow-2xl"
          >
            <SmartImage objectFit="cover" src="/images/services/demo_table_editor.png" className="absolute top-20 left-20 radius-s border-2 accent-border-weak rotate-5" />
          </div>
        </div>
      </div>

      {/* Manage Permissions */}
      <div className="mt-8 flex justify-between gap-4 flex-row-reverse">
        <div className="flex flex-col gap-4 max-w-lg">
          <Text variant="heading-strong-xl" as="h3">
            Manage Permissions
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Define roles once and let Nuvix handle the complexity. With table, column, and row-level
            controls, you get fine-grained access rules without boilerplate code.
          </Text>
          {[
            "Role-based and attribute-based permissions.",
            "Granular control across tables, columns, and rows.",
            "Built-in audit logs for compliance.",
            "One-click integration with your auth provider.",
          ].map((point) => (
            <div key={point} className="flex items-start gap-2">
              <motion.div
                className="w-2 h-2 brand-background-alpha-medium rounded-full mt-2 flex-shrink-0"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <Text variant="body-default-m" onBackground="neutral-medium">
                {point}
              </Text>
            </div>
          ))}
        </div>
        <div className="max-w-3xl rounded relative">
          <div
            className="accent-solid-medium w-full h-full rounded-sm relative shadow-2xl"
          >
            <SmartImage objectFit="cover" src="/images/services/demo_permissions.png" className="absolute top-20 right-20 rounded-sm border-2 brand-border-weak -rotate-5" />
          </div>
        </div>
      </div>

      {/* Flexible Security (RLS) */}
      <div className="mt-8 flex justify-between gap-4">
        <div className="flex flex-col gap-4 max-w-lg">
          <Text variant="heading-strong-xl" as="h3">
            Flexible Security (RLS)
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Secure your data at its source with Row-Level Security (RLS). Policies ensure every
            query respects user context, giving you enterprise-grade protection out of the box.
          </Text>
          {[
            "Fine-grained row-level access policies.",
            "Enforce visibility by tenant, user, or role.",
            "Manage policies visually or via SQL.",
            "Works seamlessly with Nuvix Auth.",
          ].map((point) => (
            <div key={point} className="flex items-start gap-2">
              <motion.div
                className="w-2 h-2 brand-background-alpha-medium rounded-full mt-2 flex-shrink-0"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <Text variant="body-default-m" onBackground="neutral-medium">
                {point}
              </Text>
            </div>
          ))}
        </div>
         <div className="max-w-3xl rounded relative">
          <div
            className="warning-solid-medium w-full h-full rounded-sm relative shadow-2xl"
          >
            <SmartImage objectFit="cover" src="/images/services/demo_rls.png" className="absolute top-20 left-20 rounded-sm border-2 brand-border-weak rotate-5" />
          </div>
        </div>
      </div>

      {/* Schema Flexibility (unique to Nuvix) */}
      {/* <div className="mt-8 flex justify-between gap-4 flex-row-reverse">
        <div className="flex flex-col gap-4 max-w-lg">
          <Text variant="heading-strong-xl" as="h3">
            Schema Flexibility
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Nuvix gives you freedom of choice. Start with a visual editor, enforce strict schemas with
            RLS, or go fully flexible with document-style storage. One platform, all data models.
          </Text>
          {[
            "Document Schema → Flexible, JSON-first.",
            "Managed Schema → Visual, enforced, secure.",
            "Unmanaged Schema → Full SQL freedom.",
            "Switch approaches as your project evolves.",
          ].map((point) => (
            <div key={point} className="flex items-start gap-2">
              <motion.div
                className="w-2 h-2 brand-background-alpha-medium rounded-full mt-2 flex-shrink-0"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <Text variant="body-default-m" onBackground="neutral-medium">
                {point}
              </Text>
            </div>
          ))}
        </div>
        <SmartImage src="/images/services/demo_schema_flexibility.png" className="max-w-3xl rounded" />
      </div> */}
    </section>
  );
};
