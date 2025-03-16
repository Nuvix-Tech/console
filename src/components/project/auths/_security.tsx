"use client";
import React, { useEffect } from "react";
import {
  SessionDuration,
  UsersLimit,
  SessionLimit,
  PasswordHistory,
  PasswordDictionary,
  PersonalData,
  SessionAlerts,
} from "./components";
import { useProjectStore } from "@/lib/store";
import { PageContainer, PageHeading } from "@/components/others";

const SecurityPage: React.FC = () => {
  const setSidebarNull = useProjectStore.use.setSidebarNull();
  useEffect(() => setSidebarNull("first"), []);

  return (
    <>
      <PageContainer>
        <PageHeading
          heading="Security"
          description="Configure security settings for your project."
        />

        <UsersLimit />
        <SessionDuration />
        <SessionLimit />
        <PasswordHistory />
        <PasswordDictionary />
        <PersonalData />
        <SessionAlerts />
      </PageContainer>
    </>
  );
};

export { SecurityPage };
