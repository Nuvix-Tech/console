import { UserLayout } from "@/components/project/auths/users";
import { LayoutSkelton } from "@/components/skeletons";
import { PropsWithParams } from "@/types";
import React, { PropsWithChildren, Suspense } from "react";

export default async function ({
  params,
  children,
}: PropsWithChildren & PropsWithParams<{ userId: string }>) {
  const { userId } = await params;

  return (
    <Suspense fallback={<LayoutSkelton />}>
      <UserLayout userId={userId}>{children}</UserLayout>
    </Suspense>
  );
}
