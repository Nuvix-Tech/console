"use client";
import {
  Background,
  Column,
  Row, SmartImage,
} from "@/once-ui/components";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Row
        marginY="32"
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
            mask={{
              x: 100,
              y: 0,
              radius: 75,
            }}
            position="absolute"
            grid={{
              display: true,
              opacity: 50,
              width: "0.5rem",
              color: "neutral-alpha-medium",
              height: "1rem",
            }}
          />
          {children}
        </Column>
      </Row>
    </>
  );
};


export default AuthLayout;
