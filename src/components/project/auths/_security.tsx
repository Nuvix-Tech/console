"use client";
import { Column } from "@/ui/components";
import { Heading } from "@chakra-ui/react";
import React from "react";
import { UsersLimit } from "./components";

const SecurityPage: React.FC = () => {
  return (
    <>
      <Column gap="20" fillWidth>
        <Heading as={"h2"} size={"xl"}>
          Security
        </Heading>

        <UsersLimit />
      </Column>
    </>
  );
};

export { SecurityPage };
