import { Column, Row, Text, Button, Accordion, Background } from "@nuvix/ui/components";
import { useState } from "react";
import { O1, O2, O3 } from "./hero_v2";
import { motion } from "motion/react";
import { HeroThreeScene } from "./hero-3d";

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
      desc: "Build secure applications without writing complex rules. Every collection, table, and file in Nuvix is configurable through an intuitive dashboard — define who can read, write, or manage with a few clicks. Whether you're coding or building visually, Nuvix keeps your data protected by default while giving you full control when you need it.",
      value: "02",
    },
    {
      title: "Everything built-in",
      desc: "From Auth and Messaging to Storage and Database, Nuvix gives you all the essentials out of the box. Every service works together seamlessly, sharing the same security, schema, and event system — so you can focus on building features, not wiring integrations.",
      value: "03",
    },
  ] as const;

  return (
    <section
      data-theme="dark"
      data-header-bg="static-transparent"
      data-header-theme="dark"
      className="relative w-full overflow-hidden"
    >
      <Background
        fill
        className="-z-10"
        gradient={{
          display: true,
          opacity: 100,
          x: -30,
          y: 20,
          tilt: 6,
          colorEnd: "neutral-background-medium",
          colorStart: "neutral-background-weak",
        }}
        lines={{
          display: false,
          opacity: 100,
          size: "16",
          thickness: 1,
          angle: 90,
          color: "brand-background-strong",
        }}
        dots={{
          display: false,
          opacity: 10,
          size: "4",
          color: "brand-background-strong",
        }}
      />
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute -top-24 left-1/3 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,109,255,0.8),rgba(124,109,255,0))] blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.75, scale: 1 }}
          transition={{ duration: 2.2, ease: "easeOut", delay: 0.2 }}
          className="absolute bottom-0 right-10 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,226,255,0.7),rgba(79,226,255,0))] blur-3xl"
        />
      </div>
      <Column
        radius="xs"
        padding="12"
        onBackground="neutral-medium"
        vertical="stretch"
        className="cont relative z-10 my-2 overflow-hidden px-2.5 -mt-16"
        position="relative"
      >
        <Row
          gap="12"
          marginTop="48"
          paddingTop="32"
          paddingX="12"
          fill
          data-header-bg="neutral-background-medium"
          data-header-theme="light"
          className="flex flex-col lg:flex-row"
        >
          <Column className="flex-1" fillHeight vertical="space-between" gap="24">
            <div className="flex-grow">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Text variant="heading-strong-xs" onSolid="accent-weak" className="uppercase">
                  Nuvix Cloud Studio
                </Text>
                <Text variant="display-strong-l" onSolid="neutral-strong" className="mt-4">
                  Build billion-dollar apps on a single, luminous backend platform.
                </Text>
                <Text variant="body-default-m" onBackground="neutral-weak" className="mt-6 max-w-xl">
                  Orchestrate auth, data, messaging, and storage with a unified API, cinematic
                  dashboards, and performance that scales from MVP to global enterprise.
                </Text>
                <Row gap="12" className="mt-8 flex-wrap">
                  <Button variant="primary" size="m">
                    Launch your stack
                  </Button>
                  <Button variant="secondary" size="m">
                    Watch the platform demo
                  </Button>
                </Row>
              </motion.div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "99.99% uptime",
                  desc: "Redundant control plane across regions.",
                },
                {
                  title: "120ms APIs",
                  desc: "Edge-cached responses everywhere.",
                },
                {
                  title: "Built-in compliance",
                  desc: "SOC2-ready workflows and audit trails.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-(--surface-border) bg-(--surface-background) p-4"
                >
                  <Text variant="heading-strong-s" onSolid="neutral-strong">
                    {item.title}
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-weak" className="mt-2">
                    {item.desc}
                  </Text>
                </div>
              ))}
            </div>
          </Column>
          <Column className="relative mt-10 flex-1 lg:mt-0" fill fillHeight>
            <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-(--surface-border) bg-(--surface-background)">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
              <HeroThreeScene />
            </div>
            <div className="mt-6 grid gap-4">
              {tabs.map((tab) => (
                <Accordion
                  key={tab.value}
                  title={
                    <Row vertical="end" gap="8">
                      <Text variant="heading-default-s" onSolid="neutral-strong">
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
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {tab.desc}
                  </Text>
                  <Text variant="body-strong-xs" onSolid="accent-weak">
                    {tab.value}
                  </Text>
                </Accordion>
              ))}
            </div>
          </Column>
        </Row>
      </Column>
    </section>
  );
};
