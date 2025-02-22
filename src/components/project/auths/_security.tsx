"use client";
import React from "react";
import { Column } from "@/ui/components";
import { Heading } from "@chakra-ui/react";
import {
  SessionDuration,
  UsersLimit,
  SessionLimit,
  PasswordHistory
} from "./components";

const SecurityPage: React.FC = () => {
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
      </Column>
    </>
  );
};

export { SecurityPage };
