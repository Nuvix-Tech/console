import { Button, Column, Text } from "@nuvix/ui/components";
import { motion } from "motion/react";
import { DOCS_URL } from "~/lib/constants";

export const BottomCtaSection = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Column
          className="py-16 md:py-20 relative min-h-80 rounded-lg my-8 overflow-hidden px-6"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-alpha-weak) 0%, var(--neutral-alpha-weak) 50%, var(--accent-alpha-weak) 100%)",
          }}
        >
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--neutral-alpha-weak) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="mx-auto max-w-2xl text-center my-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Text variant="display-strong-s" as="h2" onBackground="neutral-strong">
                Ready to build something{" "}
                <span className="text-(--brand-on-background-strong)">great?</span>
              </Text>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Text onBackground="neutral-weak" as="p" className="mt-4 text-lg leading-relaxed">
                Nuvix is open-source and free to self-host. Join the community and start building
                today.
              </Text>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button href={"https://github.com/Nuvix-Tech/nuvix"} size="m" className="group">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View on GitHub
                </span>
              </Button>
              <Button variant="secondary" href={DOCS_URL} size="m">
                Read the Docs
              </Button>
            </motion.div>
          </div>
        </Column>
      </motion.div>
    </div>
  );
};
