import ConsoleWrapper from "@/components/console/wrapper";
import { Background, Row } from "@/ui/components";
import type React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsoleWrapper>
        <Row fill position="relative">
          <Background
            position="absolute"
            gradient={{
              colorEnd: "static-transparent",
              colorStart: "neutral-alpha-strong",
              display: true,
              height: 100,
              opacity: 80,
              tilt: 20,
              width: 150,
              x: 0,
              y: 0,
            }}
            dots={{
              color: "brand-alpha-strong",
              display: true,
              opacity: 100,
              size: "64",
            }}
            grid={{
              color: "neutral-alpha-weak",
              display: true,
              height: "var(--static-space-32)",
              opacity: 100,
              width: "var(--static-space-32)",
            }}
            lines={{
              display: true,
              opacity: 20,
              size: "24",
              color: "accent-solid-weak",
            }}
          />
          <Row fill className="backdrop-blur" overflow="hidden" padding="8" gap="16">
            {children}
          </Row>
        </Row>
      </ConsoleWrapper>
    </>
  );
}
