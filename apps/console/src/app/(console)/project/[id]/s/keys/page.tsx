import { CommingSoon } from "@/components/_comming_soon";
import { PageContainer, PageHeading } from "@/components/others";
import React from "react";

const ApiKeysPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeading heading="API Keys" description="Manage your API keys here." right={null} />

      <CommingSoon />
    </PageContainer>
  );
};

export default ApiKeysPage;
