import { OrganizationPage } from "@/components/console/org/page";

export default async function ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const searchParamsObj = await searchParams;
  return <OrganizationPage id={id} searchParams={searchParamsObj} />;
}
