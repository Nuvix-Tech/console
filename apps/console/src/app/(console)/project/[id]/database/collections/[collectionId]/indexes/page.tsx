import { IndexesPage } from "@/components/project/database/collections/collection";
import { PropsWithParams } from "@/types";

type Props = {
  databaseId: string;
};

export default async function ({ params }: PropsWithParams<Props>) {
  const props = await params;
  return <IndexesPage {...props} />;
}
