import { PageContainer, PageHeading } from "@/components/others";
import React from "react";

const DomainsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeading
        heading="Custom Domains"
        description="Manage your custom domains here."
        right={null}
      />
    </PageContainer>
  );
};

export default DomainsPage;
