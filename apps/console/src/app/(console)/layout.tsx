import ConsoleWrapper from "@/components/console/wrapper";
import { Row } from "@nuvix/ui/components";
import { Stack } from "@chakra-ui/react";
import type React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsoleWrapper>
        <Row fill position="relative" background="neutral-alpha-weak">
          <Stack width="full" height="full" overflow="hidden" gap={0}>
            {children}
          </Stack>
        </Row>
      </ConsoleWrapper>
    </>
  );
}
