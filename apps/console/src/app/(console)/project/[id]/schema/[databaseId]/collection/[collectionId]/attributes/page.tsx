import { AttributesPage } from "@/components/project/schema/single/collection";
import { PropsWithParams } from "@/types";

type Props = {
  databaseId: string;
  collectionId: string;
};

export default async function ({ params }: PropsWithParams<Props>) {
  const props = await params;
  return <AttributesPage {...props} />;
}
