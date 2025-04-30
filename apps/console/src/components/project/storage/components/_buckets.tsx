import { useProjectStore } from "@/lib/store";
import { Button, Column, ToggleButton } from "@nuvix/ui/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CreateBucket } from "./_create_bucket";

export const BucketsList = () => {
  const [open, setIsOpen] = useState(false);
  const [query, setQuery] = useState();
  const sdk = useProjectStore.use.sdk?.();

  if (!sdk) return;

  const { id, bucketId } = useParams();

  const fetcher = async () => {
    return await sdk.storage.listBuckets([], query ?? undefined);
  };

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["buckets", query],
    queryFn: fetcher,
  });

  const path = `/project/${id}/buckets`;

  return (
    <>
      <Column paddingX="8" fillWidth gap="8">
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
            <ToggleButton
              fillWidth
              selected={bucket.$id === bucketId}
              href={`${path}/${bucket.$id}`}
              size="s"
              justifyContent="flex-start"
            >
              {bucket.name}
            </ToggleButton>
          </div>
        ))}

        {data.total === 0 && isFetching && <span className="text-xs text-center">Loading...</span>}
        {data.total === 0 && !isFetching && (
          <span className="text-xs text-center">
            No buckets found. Create a new bucket to get started.
          </span>
        )}
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
