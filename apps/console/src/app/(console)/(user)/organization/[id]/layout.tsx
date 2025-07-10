import OrgLayout from "@/components/console/org/layout";
import { ListPageSkeleton } from "@/components/skeletons";
import { Suspense } from "react";

export default async function ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<ListPageSkeleton />}>
      <OrgLayout id={id}>{children}</OrgLayout>
    </Suspense>
  );
}
