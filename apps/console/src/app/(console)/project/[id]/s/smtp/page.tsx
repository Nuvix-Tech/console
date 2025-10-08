import { PageContainer, PageHeading } from "@/components/others";
import { SMTPSettings } from "@/components/project/settings";
import React from "react";

const SmtpPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeading heading="SMTP Settings" description="Manage your SMTP settings here." />

      <SMTPSettings />
    </PageContainer>
  );
};

export default SmtpPage;
