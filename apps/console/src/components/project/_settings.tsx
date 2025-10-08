"use client";
import React from "react";
import { DeleteProject, ProjectInfo, UpdateName, UpdateServices } from "./components";
import { PageContainer, PageHeading } from "../others";
import { IS_PLATFORM } from "@/lib/constants";

const ProjectSettings: React.FC = () => {
  return (
    <PageContainer>
      <PageHeading heading="Project Settings" description="Configure your project settings here." />

      <ProjectInfo />
      <UpdateName />
      <UpdateServices />
      {IS_PLATFORM && <DeleteProject />}
    </PageContainer>
  );
};

export { ProjectSettings };
