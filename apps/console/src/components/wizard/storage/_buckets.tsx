import { useSuspenseQuery } from "@tanstack/react-query";
import { useBucketSelector } from "./_store";
import { useProjectStore } from "@/lib/store";
import { Text, ToggleButton } from "@nuvix/ui/components";
import { useEffect } from "react";

export const Buckets = () => {
  const { setBucket, bucket } = useBucketSelector((state) => state);
  const { sdk } = useProjectStore((state) => state);

  const { data } = useSuspenseQuery({
    queryKey: ["buckets"],
    queryFn: () => sdk.storage.listBuckets(),
  });

  useEffect(() => {
    setBucket(data.data[0]);
  }, [data.data, setBucket]);

  return (
    <div className="w-full py-2">
      <Text variant="label-strong-s">Storage Buckets</Text>
      <div className="flex flex-col w-full gap-2 mt-2">
        {data.data?.length === 0 ? (
          <Text variant="body-default-s" align="center" className="text-muted-foreground py-4">
            No storage buckets available. Create a bucket to get started.
          </Text>
        ) : (
          data.data?.map((b) => (
            <ToggleButton
              key={b.$id}
              selected={b.$id === bucket?.$id}
              fillWidth
              justifyContent="flex-start"
              onClick={() => setBucket(b)}
            >
              {b.name}
            </ToggleButton>
          ))
        )}
      </div>
    </div>
  );
};
