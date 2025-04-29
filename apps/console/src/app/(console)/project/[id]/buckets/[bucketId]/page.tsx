import { StorageSinglePage } from "@/components/project/storage/single";
import { PropsWithParams } from "@/types";

export default async function ({
  params,
}: PropsWithParams<{
  id: string;
  bucketId: string;
}>) {
  return <StorageSinglePage {...(await params)} />;
}
