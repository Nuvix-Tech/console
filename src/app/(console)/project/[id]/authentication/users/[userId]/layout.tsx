import { UserLayout } from "@/components/project/auths/users";
import { PropsWithParams } from "@/types";
import React, { PropsWithChildren } from "react";

export default async function ({
  params,
  children,
}: PropsWithChildren & PropsWithParams<{ userId: string }>) {
  const { userId } = await params;

  return <UserLayout userId={userId}>{children}</UserLayout>;
}
