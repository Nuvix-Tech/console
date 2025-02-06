import { OrganizationPage } from "@/components/console/org/page";

export default async function ({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrganizationPage id={id} />;
}
