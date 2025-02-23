"use client";
import React from "react";
import { Column } from "@/ui/components";
import { Heading } from "@chakra-ui/react";
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
        <Heading as={"h2"} size={"xl"}>
          Security
        </Heading>

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
