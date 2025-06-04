import { MessageSingleLayout } from "@/components/project/messaging/single/_layout";
import { PropsWithParams } from "@/types";
import { PropsWithChildren } from "react";

export default async function ({
  params,
  children,
}: PropsWithChildren<PropsWithParams<{ messageId: string }>>) {
  const { messageId } = await params;
  return <MessageSingleLayout messageId={messageId}>{children}</MessageSingleLayout>;
}
