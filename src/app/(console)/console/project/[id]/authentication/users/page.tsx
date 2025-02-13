import { UsersPage } from "@/components/project/auths/users/_page";
import { Skeleton } from "@/ui/components";
import React, { Suspense } from "react";

export default function () {
  return (
    <Suspense fallback={<Skeleton fill shape="block" />}>
      <UsersPage />
    </Suspense>
  );
}
