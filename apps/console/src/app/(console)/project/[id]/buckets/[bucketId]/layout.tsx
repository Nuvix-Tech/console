import { StorageSingleLayout } from "@/components/project/storage/single";
import { PropsWithParams } from "@/types";
import { PropsWithChildren } from "react";

export default async function ({
  children,
  params,
}: PropsWithChildren<
  PropsWithParams<{
    id: string;
    bucketId: string;
  }>
>) {
  const props = await params;
  return (
    <>
      <StorageSingleLayout {...props}>{children}</StorageSingleLayout>
    </>
  );
}
