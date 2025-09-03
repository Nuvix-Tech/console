"use client";
import { useParams } from "next/navigation";
import { PageContainer, PageHeading } from "@/components/others";

export default function ProjectAppsPage() {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <PageContainer>
      <PageHeading
        heading="Platforms"
        description="Manage your project applications and configurations."
        right={null}
      />
    </PageContainer>
  );
}
