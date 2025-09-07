import { CommingSoon } from "@/components/_comming_soon";
import { PageContainer, PageHeading } from "@/components/others";

export default function () {
  return (
    <PageContainer>
      <PageHeading
        heading="Usage"
        description="Monitor your organization's usage statistics and limits."
      />

      <CommingSoon />
    </PageContainer>
  );
}
