"use client";
import { Background, Column, Row, SmartImage } from "@/once-ui/components";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Row paddingX="xl" background="page" fill vertical="center">
        <Row
          marginY={"xl"}
          background="overlay"
          fillWidth
          radius="xl"
          border="neutral-alpha-weak"
          overflow="hidden"
        >
          <Row fill hide="m">
            <SmartImage src="/images/login.png" alt="Preview image" sizes="560px" />
          </Row>
          <Column fillWidth horizontal="center" gap="20" padding="32" position="relative">
            <Background
              position="absolute"
              mask={{
                x: 100,
                y: 0,
                radius: 100,
              }}
              gradient={{
                display: true,
                x: 100,
                y: 50,
                width: 70,
                height: 50,
                tilt: -40,
                opacity: 90,
                colorStart: "accent-background-strong",
                colorEnd: "page-background",
              }}
              grid={{
                display: true,
                opacity: 30,
                width: "0.25rem",
                color: "neutral-alpha-medium",
                height: "0.25rem",
              }}
            />
            <Column horizontal="center" gap="20" position="relative" maxWidth={26}>
              {children}
            </Column>
          </Column>
        </Row>
      </Row>
    </>
  );
};

export default AuthLayout;
