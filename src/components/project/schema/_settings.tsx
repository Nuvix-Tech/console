"use client";
import { PageContainer, PageHeading } from "@/components/others";
import React from "react";
import { UpdateName, DeleteDatabase, TopMeta } from "../database/components";

export const SettingsPage = () => {
  return (
    <PageContainer>
      <PageHeading heading="Settings" description="Update your database settings here." />

      <TopMeta />
      <UpdateName />
      <DeleteDatabase />
    </PageContainer>
  );
};
