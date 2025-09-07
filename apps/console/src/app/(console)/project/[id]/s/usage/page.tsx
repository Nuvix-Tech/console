import { CommingSoon } from "@/components/_comming_soon";
import { PageContainer, PageHeading } from "@/components/others";
import React from "react";

const UsagePage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeading
        heading="Usage"
        description="Monitor your project usage and limits here."
        right={null}
      />

      <CommingSoon />
    </PageContainer>
  );
};

export default UsagePage;
