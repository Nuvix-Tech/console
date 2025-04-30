import { FilePage } from "@/components/project/storage/single/_file";
import { PropsWithParams } from "@/types";

export default async function ({
  params,
}: PropsWithParams<{
  id: string;
  bucketId: string;
  fileId: string;
}>) {
  return <FilePage {...(await params)} />;
}
