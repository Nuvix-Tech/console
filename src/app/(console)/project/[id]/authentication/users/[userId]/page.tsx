import { UserPage } from "@/components/project/auths/users";
import { PropsWithParams } from "@/types";

export default async function ({ params }: PropsWithParams<{ userId: string }>) {
  const { userId } = await params;

  return <UserPage id={userId} />;
}
