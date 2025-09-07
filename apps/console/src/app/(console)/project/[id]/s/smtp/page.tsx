import { CommingSoon } from "@/components/_comming_soon";
import { PageContainer, PageHeading } from "@/components/others";
import React from "react";

const SmtpPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeading
        heading="SMTP Settings"
        description="Manage your SMTP settings here."
        right={null}
      />

      <CommingSoon />
    </PageContainer>
  );
};

export default SmtpPage;
