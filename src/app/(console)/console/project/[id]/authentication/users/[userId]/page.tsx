import { UserPage } from "@/components/project/auths/users/page";
import { Suspense } from "react";

export default async function ({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserPage id={userId} />
    </Suspense>
  );
}
