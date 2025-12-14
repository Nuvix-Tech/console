"use client";
import React from "react";
import {
  DeleteProject,
  ProjectInfo,
  UpdateName,
  UpdateServices,
  ManageExposedSchemas,
} from "./components";
import { PageContainer, PageHeading } from "../others";
import { IS_PLATFORM } from "@/lib/constants";

const ProjectSettings: React.FC = () => {
  return (
    <PageContainer>
      <PageHeading heading="Project Settings" description="Configure your project settings here." />

      <ProjectInfo />
      <UpdateName />
      <UpdateServices />
      <ManageExposedSchemas />
      {IS_PLATFORM && <DeleteProject />}
    </PageContainer>
  );
};

export { ProjectSettings };
