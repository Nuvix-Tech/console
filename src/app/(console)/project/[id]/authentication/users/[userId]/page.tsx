import { UserPage } from "@/components/project/auths/users";
import { PropsWithParams } from "@/types";
import { Suspense } from "react";

export default async function ({ params }: PropsWithParams<{ userId: string }>) {
  const { userId } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserPage id={userId} />
    </Suspense>
  );
}
