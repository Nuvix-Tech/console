"use client";
import { Column } from "@/ui/components";
import { Heading } from "@chakra-ui/react";
import React from "react";
import { SessionDuration, UsersLimit, SessionLimit } from "./components";

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
      </Column>
    </>
  );
};

export { SecurityPage };
