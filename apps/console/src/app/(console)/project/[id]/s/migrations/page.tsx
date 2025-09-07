import { CommingSoon } from "@/components/_comming_soon";
import { PageContainer, PageHeading } from "@/components/others";
import React from "react";

const MigrationsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeading
        heading="Migrations"
        description="Migrate from other platforms easily."
        right={null}
      />

      <CommingSoon />
    </PageContainer>
  );
};

export default MigrationsPage;
