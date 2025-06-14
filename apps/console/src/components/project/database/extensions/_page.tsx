"use client";

import { PageContainer, PageHeading } from "@/components/others";
import Extensions from "./_list";

export const ExtensionsPage = () => {
  return (
    <>
      <PageContainer>
        <PageHeading
          heading="Database Extensions"
          description="Manage and configure PostgreSQL extensions to extend your database functionality with additional features and capabilities."
        />
        <Extensions />
      </PageContainer>
    </>
  );
};
