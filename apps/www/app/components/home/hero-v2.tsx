import { Column, Row, Text, Button, Accordion } from "@nuvix/ui/components";
import { useState } from "react";
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
    <div data-theme="dark" className="container mx-auto my-2">
      <Column
        background="accent-weak"
        radius="xs"
        padding="20"
        onBackground="accent-weak"
        vertical="stretch"
      >
        <Row gap="8" marginTop="48" paddingTop="24" paddingX="12" fill>
          <Column className="max-w-xs" fillHeight vertical="space-between" gap="24">
            <div className="flex-grow">
              <Text variant="display-strong-s" onSolid="neutral-strong">
                Start simple.
                <br />
                Scale your way.
              </Text>
              <Button variant="secondary" size="m" className="mt-8">
                Get Started
              </Button>
            </div>
            <div className="mt-auto flex-shrink flex flex-col divide-y divide-(--accent-alpha-medium)">
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
                  <Text variant="body-default-s" onSolid="accent-weak">
                    {tab.desc}
                  </Text>
                  <Text variant="body-strong-xs" onSolid="accent-medium">
                    {tab.value}
                  </Text>
                </Accordion>
              ))}
            </div>
          </Column>
          <Column className="flex-grow" fill fillHeight>
            {openTab === "01" && <O1 />}
            {openTab === "02" && <O2 />}
            {openTab === "03" && <O3 />}
          </Column>
        </Row>
      </Column>
    </div>
  );
};
