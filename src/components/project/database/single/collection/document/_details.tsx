"use client";
import React from "react";
import { UpdatePermissions } from "./components";
import { DeleteDocument } from "./components/_delete";
import { PageContainer } from "@/components/others";

const DocumentDetails: React.FC = () => {
  return (
    <PageContainer>
      <UpdatePermissions />
      <DeleteDocument />
    </PageContainer>
  );
};

export { DocumentDetails };
