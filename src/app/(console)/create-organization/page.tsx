import React from "react";
import { Metadata } from "next";
import { Stack } from "@chakra-ui/react";
import { Text } from "@/ui/components";

export const metadata: Metadata = {
  title: "Create Organization",
  description: "Create a new organization",
};

export default function CreateOrganization() {
  return (
    <>
      <div className="p-6">
        <Text variant="heading-strong-m">Create a new organization</Text>
        <Stack direction={{ base: "column", md: "row" }} gap={4}>
          <Stack width={"70%"}></Stack>
          <Stack></Stack>
        </Stack>
      </div>
    </>
  );
}
