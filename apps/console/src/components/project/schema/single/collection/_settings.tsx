"use client";
import React from "react";
import {
  DeleteCollection,
  DocumentSecurity,
  MetaEnable,
  UpdateName,
  UpdatePermissions,
} from "./components";
import { PageContainer, PageHeading } from "@/components/others";

const SettingsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeading
        heading="Settings"
        description="Configure the collection settings, permissions, and more."
      />
      <MetaEnable />
      <UpdateName />
      <UpdatePermissions />
      <DocumentSecurity />
      <DeleteCollection />
    </PageContainer>
  );
};

export { SettingsPage };
