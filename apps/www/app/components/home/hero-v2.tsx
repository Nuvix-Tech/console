import { Column, Row, Text, Button, Accordion, Background } from "@nuvix/ui/components";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { O1, O2, O3 } from "./hero_v2";

export const HeroV2 = () => {
  const [openTab, setOpenTab] = useState("01");

  const tabs = [
    {
      title: "Flexible by design",
      desc: "Model data your way with NoSQL or SQL and evolve without limits. Nuvix unifies every schema under one API and permission system, so security, structure, and scale work together from day one.",
      value: "01",
    },
    {
      title: "Security without setup",
      desc: "Build secure applications without writing complex rules. Every collection, table, and file in Nuvix is configurable through an intuitive dashboard — define who can read, write, or manage with a few clicks.",
      value: "02",
    },
    {
      title: "Everything built-in",
      desc: "From Auth and Messaging to Storage and Database, Nuvix gives you all the essentials out of the box. Every service works together seamlessly, sharing the same security, schema, and event system.",
      value: "03",
    },
  ] as const;

  const illustrations = {
    "01": O1,
    "02": O2,
    "03": O3,
  };
  const ActiveIllustration = illustrations[openTab];

  return (
    <section
      data-theme="dark"
      data-header-bg="static-transparent"
      data-header-theme="dark"
      className="w-full cont my-2 px-2.5 -mt-16"
    >
      <Column
        radius="xs"
        padding="12"
        onBackground="neutral-medium"
        vertical="stretch"
        className="overflow-hidden z-5"
        position="relative"
      >
        <Background
          fill
          className="-z-5"
          gradient={{
            display: true,
            opacity: 100,
            x: 10,
            y: 5,
            tilt: -1,
            colorEnd: "neutral-background-medium",
            colorStart: "neutral-background-weak",
          }}
          dots={{
            display: true,
            opacity: 4,
            size: "2",
            color: "brand-background-strong",
          }}
        />
        <Row
          gap="12"
          marginTop="48"
          paddingTop="24"
          paddingX="12"
          fill
          data-header-bg="neutral-background-medium"
          data-header-theme="light"
        >
          <Column className="md:max-w-sm" fillHeight vertical="space-between" gap="24">
            <div className="flex-grow">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Text variant="display-strong-s" onSolid="neutral-strong" className="">
                  Start simple.
                  <br />
                  <span className="text-(--brand-on-background-strong)">Scale your way.</span>
                </Text>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button variant="primary" size="s" className="mt-8 group">
                  <span className="flex items-center gap-2">
                    Start building
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </Button>
              </motion.div>
            </div>
            <motion.div
              className="mt-auto flex-shrink flex flex-col divide-y divide-(--neutral-alpha-weak)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {tabs.map((tab, index) => (
                <Accordion
                  key={tab.value}
                  title={
                    <Row vertical="center" gap="8">
                      <span
                        className={`text-xs font-mono transition-colors ${
                          openTab === tab.value
                            ? "text-(--brand-on-background-strong)"
                            : "text-(--neutral-on-background-weak)"
                        }`}
                      >
                        {tab.value}
                      </span>
                      <Text
                        variant="heading-default-s"
                        className={`transition-colors ${
                          openTab === tab.value ? "!text-(--neutral-on-background-strong)" : ""
                        }`}
                        onSolid="neutral-medium"
                      >
                        {tab.title}
                      </Text>
                    </Row>
                  }
                  open={openTab === tab.value}
                  toggleAccordion={() => setOpenTab(tab.value)}
                  size="s"
                  radius="xs"
                  icon=""
                >
                  <Text
                    variant="body-default-s"
                    onBackground="neutral-weak"
                    className="leading-relaxed"
                  >
                    {tab.desc}
                  </Text>
                </Accordion>
              ))}
            </motion.div>
          </Column>
          <Column className="flex-grow !hidden md:!flex" fill fillHeight>
            <AnimatePresence mode="wait">
              <motion.div
                key={openTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="size-full"
              >
                <ActiveIllustration />
              </motion.div>
            </AnimatePresence>
          </Column>
        </Row>
      </Column>
    </section>
  );
};
