import { PropsWithParams } from "@/types";
import { PropsWithChildren, Suspense } from "react";
import { CollectionLayout } from "@/components/project/database/single/collection";

export default async function ({
  children,
  params,
}: PropsWithChildren & PropsWithParams<{ databaseId: string; collectionId: string }>) {
  const props = await params;

  return (
    <Suspense fallback="You know, what is going on :)?">
      <CollectionLayout {...props}>{children}</CollectionLayout>
    </Suspense>
  );
}
