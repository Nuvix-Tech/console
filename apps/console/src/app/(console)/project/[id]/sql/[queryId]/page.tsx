import { SqlEditorPage } from "@/components/project/sql";
import { PropsWithParams } from "@/types";

export default async function ({ params }: PropsWithParams<{ queryId: string; id: string }>) {
  const { queryId, id } = await params;

  return <SqlEditorPage id={queryId} />;
}
