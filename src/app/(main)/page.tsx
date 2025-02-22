"use client";

import type React from "react";
import {
  Background,
  Button,
  Column,
  Fade,
  Heading,
  IconButton,
  InlineCode,
  Logo,
  Row,
  Text,
  TiltFx,
} from "@/ui/components";
import { CodeBlock } from "@/ui/modules";

export default function Home() {
  return (
    <Column fillWidth paddingY="80" paddingX="s" horizontal="center" flex={1}>
      <Fade
        zIndex={3}
        pattern={{
          display: true,
          size: "4",
        }}
        position="fixed"
        top="0"
        left="0"
        to="bottom"
        height={5}
        fillWidth
        blur={0.25}
      />
      <Row position="fixed" top="0" fillWidth horizontal="center" zIndex={3}>
        <Row
          data-border="rounded"
          horizontal="space-between"
          maxWidth="l"
          paddingRight="64"
          paddingLeft="32"
          paddingY="20"
        >
          <Logo
            size="m"
            icon={false}
            href="https://nuvix.in"
            wordmarkSrc="/trademark/nuvix-logo-dark.svg"
          />
          <Row gap="12" hide="s">
            <Button
              href="https://discord.com/"
              prefixIcon="discord"
              size="s"
              label="Discord"
              weight="default"
              variant="tertiary"
            />
            <Button
              href="https://github.com/ravikan6/console"
              prefixIcon="github"
              size="s"
              label="GitHub"
              weight="default"
              variant="tertiary"
            />
          </Row>
          <Row gap="16" show="s" horizontal="center" paddingRight="24">
            <IconButton href="https://discord.com/invite" icon="discord" variant="tertiary" />
            <IconButton
              href="https://github.com/ravikan6/console"
              icon="github"
              variant="tertiary"
            />
          </Row>
        </Row>
      </Row>
      <Column
        overflow="hidden"
        as="main"
        maxWidth="l"
        position="relative"
        radius="xl"
        horizontal="center"
        border="neutral-alpha-weak"
        fillWidth
      >
        <Column
          fillWidth
          horizontal="center"
          gap="48"
          radius="xl"
          paddingTop="80"
          position="relative"
        >
          <Background
            mask={{
              x: 0,
              y: 48,
            }}
            position="absolute"
            grid={{
              display: true,
              width: "0.25rem",
              color: "neutral-alpha-medium",
              height: "0.25rem",
            }}
          />
          <Background
            mask={{
              x: 80,
              y: 0,
              radius: 100,
            }}
            position="absolute"
            gradient={{
              display: true,
              tilt: -35,
              height: 50,
              width: 75,
              x: 100,
              y: 40,
              colorStart: "accent-solid-medium",
              colorEnd: "static-transparent",
            }}
          />
          <Background
            mask={{
              x: 100,
              y: 0,
              radius: 100,
            }}
            position="absolute"
            gradient={{
              display: true,
              opacity: 100,
              tilt: -35,
              height: 20,
              width: 120,
              x: 120,
              y: 35,
              colorStart: "brand-solid-strong",
              colorEnd: "static-transparent",
            }}
          />
          <Column fillWidth horizontal="center" gap="32" padding="32" position="relative">
            <InlineCode radius="xl" shadow="m" fit paddingX="16" paddingY="8">
              Currently{" "}
              <Text onBackground="brand-medium" marginLeft="8">
                In Devlopment
              </Text>
            </InlineCode>
            <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
              Welcome to Console
            </Heading>
            <Text>Click below button to access the dashboard</Text>
            <Button id="readDocs" label="Console" href="/console" variant="secondary" arrowIcon />
          </Column>
        </Column>

        {/* CODE PREVIEW */}
        <TiltFx fillWidth paddingX="32" paddingTop="64">
          <Column
            border="neutral-alpha-weak"
            paddingX="32"
            radius="xl"
            overflow="hidden"
            paddingY="160"
            fillWidth
            position="relative"
          >
            <Background
              mask={{
                x: 100,
                y: 0,
              }}
              position="absolute"
              grid={{
                display: true,
                color: "neutral-alpha-medium",
                width: "2rem",
                height: "2rem",
              }}
            />
            <Background
              mask={{
                x: 0,
                y: 100,
                radius: 100,
              }}
              position="absolute"
              grid={{
                display: true,
                color: "brand-alpha-strong",
                width: "12",
                height: "12",
              }}
              gradient={{
                display: true,
                opacity: 100,
                height: 100,
                width: 100,
                tilt: 0,
                x: 0,
                y: 100,
                colorStart: "brand-solid-strong",
                colorEnd: "brand-background-medium",
              }}
            />
            <Column horizontal="center" gap="48" fillWidth position="relative">
              <Heading align="center" as="h2" variant="display-default-l">
                Quick start
              </Heading>
              <CodeBlock
                compact
                maxWidth={40}
                codeInstances={[
                  {
                    code: `THE RIGHT WAY TO BUILD MODERN APPS`,
                    language: "plaintext",
                    label: "Console",
                  },
                ]}
              />
            </Column>
          </Column>
        </TiltFx>
      </Column>
    </Column>
  );
}
