"use client";
import { Column } from "@/ui/components";
import { Heading, Text } from "@chakra-ui/react";
import React from "react";
import {
  DeleteCollection,
  DocumentSecurity,
  MetaEnable,
  UpdateName,
  UpdatePermissions,
} from "./components";

const SettingsPage: React.FC = () => {
  return (
    <Column gap="20" fillWidth padding="20">
      <Column gap="4">
        <Heading as={"h2"} size={"xl"}>
          Settings
        </Heading>
        <Text textStyle="sm" color="fg.subtle">
          Manage collection settings, including metadata and document security options.
        </Text>
      </Column>

      <MetaEnable />
      <UpdateName />
      <UpdatePermissions />
      <DocumentSecurity />
      <DeleteCollection />
    </Column>
  );
};

export { SettingsPage };
