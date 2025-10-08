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
        data-theme="light"
        className="!bg-(--neutral-on-background-strong) md:!bg-(--page-background)"
      >
        <Stack
          height={{ base: "100svh" }}
          my="auto"
          width={{ base: "full" }}
          direction={{ base: "row" }}
        >
          <Row fill hide="m" position="relative">
            <Fade to="right">
              <SmartImage src="/images/login_bg.png" alt="Preview image" sizes="560px" />
            </Fade>
            <div className="absolute bottom-32 left-10 bg-(--neutral-alpha-weak) p-4 backdrop-blur rounded-sm">
              <Text
                variant="display-strong-l"
                className="bg-gradient-to-b from-white to-(--accent-solid-strong) bg-clip-text text-transparent"
              >
                Start simple, <br /> Scale your way
              </Text>
            </div>
          </Row>
          <Column fill center gap="20" padding="32" position="relative" data-theme={resolvedTheme}>
            <Background
              position="absolute"
              mask={{
                x: 100,
                y: 0,
                radius: 100,
              }}
              gradient={{
                display: false,
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
              className="md:!items-center md:!bg-background !bg-transparent"
              radius="l"
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
