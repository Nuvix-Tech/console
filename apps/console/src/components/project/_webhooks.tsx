"use client";
import React from "react";
import { PageContainer, PageHeading } from "@/components/others";
import { CommingSoon } from "../_comming_soon";

const WebhooksPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeading heading="Webhooks" description="Manage your webhooks here." right={null} />

      <CommingSoon />
    </PageContainer>
  );
};

export { WebhooksPage };
