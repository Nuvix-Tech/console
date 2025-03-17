import { TeamLayout } from "@/components/project/auths/teams";
import { LayoutSkelton } from "@/components/skeletons";
import { PropsWithParams } from "@/types";
import React, { PropsWithChildren, Suspense } from "react";

export default async function ({
  children,
  params,
}: PropsWithChildren & PropsWithParams<{ teamId: string }>) {
  const { teamId } = await params;
  return (
    <Suspense fallback={<LayoutSkelton />}>
      <TeamLayout teamId={teamId}>{children}</TeamLayout>
    </Suspense>
  );
}
