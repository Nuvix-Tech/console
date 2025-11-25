import { Column, Row, Text, Button, Accordion, Background } from "@nuvix/ui/components";
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
    <div data-theme="dark" className="w-full cont my-2 px-2.5 -mt-16">
      <Column
        // background="danger-weak"
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
        <Row gap="12" marginTop="48" paddingTop="24" paddingX="12" fill>
          <Column className="md:max-w-xs" fillHeight vertical="space-between" gap="24">
            <div className="flex-grow">
              <Text variant="display-strong-s" onSolid="neutral-strong" className="">
                Start simple.
                <br />
                Scale your way.
              </Text>
              <Button variant="primary" size="s" className="mt-8 ">
                Start building
              </Button>
            </div>
            <div className="mt-auto flex-shrink flex flex-col divide-y divide-(--brand-alpha-weak)">
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
          <Column className="flex-grow !hidden md:!flex" fill fillHeight>
            {openTab === "01" && <O1 />}
            {openTab === "02" && <O2 />}
            {openTab === "03" && <O3 />}
          </Column>
        </Row>
      </Column>
    </div>
  );
};
