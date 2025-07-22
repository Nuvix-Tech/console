import { AccountHeader } from "@/components/account";
import { Stack } from "@chakra-ui/react";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AccountHeader />
      <Stack
        direction={"column"}
        position="relative"
        as={"main"}
        gap={0}
        className="mt-16 page-background"
        overflowY={"auto"}
      >
        {children}
      </Stack>
    </>
  );
}
