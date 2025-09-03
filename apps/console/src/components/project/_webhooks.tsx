"use client";
import React from "react";
import { PageContainer, PageHeading } from "@/components/others";

const WebhooksPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeading heading="Webhooks" description="Manage your webhooks here." right={null} />
    </PageContainer>
  );
};

export { WebhooksPage };
