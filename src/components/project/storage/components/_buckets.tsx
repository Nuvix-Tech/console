import { useProjectStore } from "@/lib/store";
import { Button, Column, ToggleButton } from "@/ui/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CreateBucket } from "./_create_bucket";

export const BucketsList = () => {
  const [open, setIsOpen] = useState(false);
  const [query, setQuery] = useState();
  const sdk = useProjectStore.use.sdk?.();

  if (!sdk) return;

  const { bucketId } = useParams();

  const fetcher = async () => {
    return await sdk.storage.listBuckets([], query ?? undefined);
  };

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["buckets", query],
    queryFn: fetcher,
  });

  return (
    <>
      <Column paddingX="8" fillWidth>
        <Button
          fillWidth
          prefixIcon={"plus"}
          size="s"
          variant="secondary"
          onClick={() => setIsOpen(true)}
        >
          New Bucket
        </Button>

        {data?.buckets.map((bucket) => (
          <div key={bucket.$id}>
            <ToggleButton selected={bucket.$id === bucketId}>{bucket.name}</ToggleButton>
          </div>
        ))}

        {isFetching && <div>Loading...</div>}

        {data.total === 0 && "NO BUCKETS FOUND"}
      </Column>
      <CreateBucket
        isOpen={open}
        onClose={() => {
          refetch();
          setIsOpen(false);
        }}
      />
    </>
  );
};
