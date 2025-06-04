import { PropsWithParams } from "@/types";

export default async function ({ params }: PropsWithParams<{ messageId: string }>) {
  const { messageId } = await params;
}
