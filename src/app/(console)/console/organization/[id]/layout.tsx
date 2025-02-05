import OrgLayout from "@/components/console/org/layout";

export default async function ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  return <OrgLayout id={id}>
    {children}
  </OrgLayout>;
}