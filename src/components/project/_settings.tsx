"use client";
import { Column } from "@/ui/components";
import { Heading, Text } from "@chakra-ui/react";
import React from "react";
import { DeleteProject, ProjectInfo, UpdateName, UpdateServices } from "./components";

const ProjectSettings: React.FC = () => {
  return (
    <Column gap="20" fillWidth padding="20">
      <Column gap="4">
        <Heading as={"h2"} size={"xl"}>
          Project Settings
        </Heading>
        <Text textStyle="sm" color="fg.subtle">
          Configure your project settings here.
        </Text>
      </Column>

      <ProjectInfo />
      <UpdateName />
      <UpdateServices />
      <DeleteProject />
    </Column>
  );
};

export { ProjectSettings };
