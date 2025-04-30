import ConsoleWrapper from "@/components/console/wrapper";
import { Background, Row } from "@nuvix/ui/components";
import { Stack } from "@chakra-ui/react";
import type React from "react";
import { Toaster } from "sonner";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsoleWrapper>
        <Row fill position="relative">
          <Background
            position="absolute"
            gradient={{
              colorEnd: "neutral-background-medium",
              colorStart: "brand-alpha-medium",
              display: true,
              height: 180,
              opacity: 60,
              tilt: -31,
              width: 150,
              x: 0,
              y: 0,
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
        <Toaster richColors position="top-right" />
      </ConsoleWrapper>
    </>
  );
}
