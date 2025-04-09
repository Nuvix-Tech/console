"use client";
import { useProjectStore } from "@/lib/store";
import { useSuspenseQuery } from "@tanstack/react-query";

export const FilePage = ({
  bucketId,
  fileId,
}: {
  bucketId: string;
  fileId: string;
}) => {
  const sdk = useProjectStore.use.sdk();

  const fetcher = async () => {
    const data = await sdk.storage.getFile(bucketId, fileId);
    return data;
  };

  const { data } = useSuspenseQuery({
    queryKey: ["file", bucketId, fileId],
    queryFn: fetcher,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-bold">{data.name}</div>
      <div className="text-sm text-gray-500">{data.sizeOriginal} bytes</div>
      <div className="text-sm text-gray-500">{data.$createdAt}</div>
      <div className="text-sm text-gray-500">{data.$updatedAt}</div>
    </div>
  );
};
