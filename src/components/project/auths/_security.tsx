"use client";
import React from "react";
import { Column } from "@/ui/components";
import { Heading, Text } from "@chakra-ui/react";
import {
  SessionDuration,
  UsersLimit,
  SessionLimit,
  PasswordHistory,
  PasswordDictionary,
  PersonalData,
  SessionAlerts,
} from "./components";
import { projectState } from "@/state/project-state";

const SecurityPage: React.FC = () => {
  projectState.sidebar.first = null;

  return (
    <>
      <Column gap="20" fillWidth padding="20">
        <Column gap="4">
          <Heading as={"h2"} size={"xl"}>
            Security
          </Heading>
          <Text textStyle="sm" color="fg.subtle">
            Configure security settings for your project.
          </Text>
        </Column>

        <UsersLimit />
        <SessionDuration />
        <SessionLimit />
        <PasswordHistory />
        <PasswordDictionary />
        <PersonalData />
        <SessionAlerts />
      </Column>
    </>
  );
};

export { SecurityPage };
