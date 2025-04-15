import ConsoleWrapper from "@/components/console/wrapper";
import { Background, Row } from "@/ui/components";
import { Stack } from "@chakra-ui/react";
import type React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsoleWrapper>
        <Row fill position="relative">
          <Background
            position="absolute"
            gradient={{
              colorEnd: "neutral-background-medium",
              colorStart: "brand-alpha-strong",
              display: true,
              height: 50,
              opacity: 80,
              tilt: 35,
              width: 50,
              x: 20,
              y: 20,
            }}
            // dots={{
            //   color: "accent-background-strong",
            //   display: true,
            //   opacity: 100,
            //   size: "64",
            // }}
            // grid={{
            //   color: "neutral-alpha-weak",
            //   display: true,
            //   height: "var(--static-space-32)",
            //   opacity: 100,
            //   width: "var(--static-space-32)",
            // }}
            // lines={{
            //   display: true,
            //   opacity: 20,
            //   size: "24",
            //   color: "accent-solid-weak",
            // }}
          />
          <Stack
            width="full"
            height="full"
            className="backdrop-blur-xl"
            flexDirection={"row"}
            overflow="hidden"
            padding={{ base: 0, lg: `var(--static-space-8)` }}
            gap={{ base: 0, lg: `var(--static-space-16)` }}
          >
            {children}
          </Stack>
        </Row>
      </ConsoleWrapper>
    </>
  );
}
