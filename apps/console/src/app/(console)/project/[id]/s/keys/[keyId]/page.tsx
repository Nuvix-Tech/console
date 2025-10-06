import { PageContainer } from "@/components/others";
import { KeyPage } from "@/components/project/settings/keys/single";
import { PropsWithParams } from "@/types";
import React from "react";

const ApiKeyPage: React.FC<PropsWithParams<{ keyId: string }>> = async ({ params }) => {
  const { keyId } = await params;
  return (
    <PageContainer>
      <KeyPage keyId={keyId} />
    </PageContainer>
  );
};

export default ApiKeyPage;
