"use client";
import React, { useEffect } from "react";
import { AuthMethods, AuthProviders } from "./components";
import { useProjectStore } from "@/lib/store";
import { PageContainer, PageHeading } from "@/components/others";

const SettingsPage: React.FC = () => {
  const setSidebarNull = useProjectStore.use.setSidebarNull();

  useEffect(() => setSidebarNull("first"), []);

  return (
    <PageContainer>
      <PageHeading
        heading="Settings"
        description="Configure the authentication methods your project will use."
      />

      <AuthMethods />
      <AuthProviders />
    </PageContainer>
  );
};

export { SettingsPage };
