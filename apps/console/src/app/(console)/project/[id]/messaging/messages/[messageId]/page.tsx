import { MessageSinglePage } from "@/components/project/messaging/single";
import { PropsWithParams } from "@/types";

export default async function ({ params }: PropsWithParams<{ messageId: string }>) {
  const { messageId } = await params;

  return <MessageSinglePage messageId={messageId} />;
}
