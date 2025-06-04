import { TopicLayout } from "@/components/project/messaging/topics/single";
import { PropsWithParams } from "@/types";
import { PropsWithChildren } from "react";

export default async function ({
  children,
  params,
}: PropsWithChildren<PropsWithParams<{ topicId: string }>>) {
  const { topicId } = await params;

  return <TopicLayout topicId={topicId}>{children}</TopicLayout>;
}
