import { UsersLayout } from "@/components/project/auths/users";
import { PropsWithChildren } from "react";

export default function ({ children }: PropsWithChildren) {
  return <UsersLayout>{children}</UsersLayout>;
}
