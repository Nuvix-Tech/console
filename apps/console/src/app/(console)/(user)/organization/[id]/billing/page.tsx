import { CommingSoon } from "@/components/_comming_soon";
import { PageContainer, PageHeading } from "@/components/others";

export default function () {
  return (
    <PageContainer>
      <PageHeading
        heading="Billing"
        description="Manage your billing information and subscriptions."
      />

      <CommingSoon />
    </PageContainer>
  );
}
