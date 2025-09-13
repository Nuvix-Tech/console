import { Text } from "@nuvix/ui/components";
import { motion } from "motion/react";

export const SchemasSection = () => {
  return (
    <section className="py-12">
      <Text className="text-center" variant="display-strong-xs" as="h2">
        One Platform, Three Ways to Model Data
      </Text>
      <Text onBackground="neutral-weak" className="text-center" as="p">
        Nuvix gives you schema flexibility without compromise. Start simple with documents, enforce
        security with managed schemas, or go full power with raw SQL.
      </Text>
    </section>
  );
};
