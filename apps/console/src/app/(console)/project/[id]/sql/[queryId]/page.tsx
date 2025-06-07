import { PropsWithParams } from "@/types";

export default async function ({ params }: PropsWithParams<{ queryId: string; id: string }>) {
  const { queryId, id } = await params;

  return <>HELLO From Query Page</>;
}
