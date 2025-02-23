"use client";
import { projectState } from "@/state/project-state";
import { Column } from "@/ui/components";
import { Heading, Text } from "@chakra-ui/react";
import React from "react";
import { AuthMethods } from "./components";

const SettingsPage: React.FC = () => {
  projectState.sidebar.first = null;

  return (
    <Column gap="20" fillWidth padding="20">
      <Column gap="4">
        <Heading as={"h2"} size={"xl"}>
          Settings
        </Heading>
        <Text textStyle="sm" color="fg.subtle">
          Update authentication settings here.
        </Text>
      </Column>

      <AuthMethods />
    </Column>
  );
};

export { SettingsPage };
