"use client";
import { Background, Column, Fade, Logo, Row, SmartImage, Text } from "@nuvix/ui/components";
import { Stack } from "@chakra-ui/react";
import { useTheme } from "next-themes";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <Row
        background="page"
        fill
        position="relative"
        // data-theme="light"
        className="!bg-(--neutral-on-background-strong) md:!bg-(--page-background)"
      >
        <Stack
          height={{ base: "100svh" }}
          my="auto"
          width={{ base: "full" }}
          direction={{ base: "row" }}
        >
          <Row fill hide="m" position="relative" background="surface">
            <Logo icon={false} className="pt-4 pl-4" />
            <Background
              position="absolute"
              mask={{
                x: 50,
                y: 100,
                radius: 50,
              }}
              gradient={{
                display: true,
                x: 100,
                y: 50,
                width: 70,
                height: 50,
                tilt: -40,
                opacity: 90,
                colorStart: "accent-solid-medium",
                colorEnd: "page-background",
              }}
              grid={{
                display: true,
                opacity: 30,
                width: "0.25rem",
                color: "accent-alpha-medium",
                height: "0.25rem",
              }}
            />
            <div className="absolute bottom-32 left-10">
              <Text
                variant="display-strong-l"
                className="bg-gradient-to-b from-(--neutral-on-background-strong) via-(--accent-solid-weak) to-(--neutral-on-background-strong) bg-clip-text text-transparent"
              >
                Start simple, <br /> Scale your way
              </Text>
            </div>
          </Row>
          <Column fill gap="20" padding="32" position="relative">
            {children}
          </Column>
        </Stack>
      </Row>
    </>
  );
};

export default AuthLayout;
