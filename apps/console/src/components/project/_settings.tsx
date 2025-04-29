"use client";
import React from "react";
import { DeleteProject, ProjectInfo, UpdateName, UpdateServices } from "./components";
import { PageContainer, PageHeading } from "../others";

const ProjectSettings: React.FC = () => {
  return (
    <PageContainer>
      <PageHeading heading="Project Settings" description="Configure your project settings here." />

      <ProjectInfo />
      <UpdateName />
      <UpdateServices />
      <DeleteProject />
    </PageContainer>
  );
};

export { ProjectSettings };
