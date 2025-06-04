import { TopicSinglePage } from "@/components/project/messaging/topics/single";
import { PropsWithParams } from "@/types";

export default async function ({ params }: PropsWithParams<{ topicId: string }>) {
  const { topicId } = await params;

  return <TopicSinglePage topicId={topicId} />;
}
