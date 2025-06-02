import { useSuspenseQuery } from "@tanstack/react-query";
import { useBucketSelector } from "./_store";
import { useProjectStore } from "@/lib/store";
import { Text, ToggleButton } from "@nuvix/ui/components";
import { useEffect } from "react";

export const Buckets = () => {
  const { setBucket, bucket } = useBucketSelector((state) => state);
  const { sdk } = useProjectStore((state) => state);

  const fetcher = async () => {
    return await sdk.storage.listBuckets();
  };

  const { data } = useSuspenseQuery({
    queryKey: ["buckets"],
    queryFn: fetcher,
  });

  useEffect(() => {
    if (!bucket) {
      setBucket(data.buckets?.[0]);
    }
  }, [data]);

  return (
    <>
      <div className="w-full py-2">
        <Text variant="label-strong-s">Buckets</Text>
        <div className="flex flex-col w-full gap-2 mt-2">
          {data.total === 0 ? (
            <Text variant="body-default-s" align="center">
              No buckets found.
            </Text>
          ) : (
            ""
          )}
          {data.buckets.map((b) => (
            <ToggleButton
              key={b.$id}
              selected={b.$id === bucket?.$id}
              fillWidth
              justifyContent="flex-start"
              onClick={() => setBucket(b)}
            >
              {b.name}
            </ToggleButton>
          ))}
        </div>
      </div>
    </>
  );
};
