"use client";
import { Background, Column, Row, SmartImage } from "@nuvix/ui/components";
import { Stack } from "@chakra-ui/react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Row background="page" fill position="relative">
        <Stack
          height={{ base: "100svh" }}
          my="auto"
          width={{ base: "full" }}
          direction={{ base: "row" }}
        >
          {/* <Row fill hide="m">
            <SmartImage src="/images/login.png" alt="Preview image" sizes="560px" />
          </Row> */}
          <Column fill center gap="20" padding="32" position="relative">
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
                colorStart: "brand-background-weak",
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
            <Column
              horizontal="center"
              gap="20"
              position="relative"
              maxWidth={26}
              className="md:!items-center"
            >
              {children}
            </Column>
          </Column>
        </Stack>
      </Row>
    </>
  );
};

export default AuthLayout;
