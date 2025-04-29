import { DangerCard } from "@/components/others/danger-card";
import { formatDate } from "@/lib/utils";
import { useConfirm, useToast } from "@/ui/components";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import { useBucketStore, useProjectStore } from "@/lib/store";

export const DeleteBucket = () => {
  const project = useProjectStore.use.project?.();
  const sdk = useProjectStore.use.sdk?.();
  const bucket = useBucketStore.use.bucket?.();

  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { replace } = useRouter();
  const confirm = useConfirm();

  if (!bucket || !sdk) return;

  const deleteBucket = async (id: string) => {
    if (
      await confirm({
        title: "Delete Bucket",
        description: "Are you sure you want to delete this bucket?",
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      try {
        setLoading(true);
        await sdk.storage.deleteBucket(id);
        addToast({
          variant: "success",
          message: "Bucket deleted successfully",
        });
        replace(`/project/${project?.$id}/buckets`);
      } catch (e: any) {
        addToast({
          variant: "danger",
          message: e.message,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <DangerCard
      title="Delete Bucket"
      description="The bucket will be permanently deleted. This action is irreversible."
      actions={
        <Button
          variant={"surface"}
          colorPalette="red"
          loading={loading}
          onClick={() => deleteBucket(bucket?.$id)}
          loadingText={"Deleting..."}
        >
          Delete
        </Button>
      }
    >
      <VStack alignItems={"flex-start"} gap={0.2}>
        <Text textStyle="md" fontWeight="semibold">
          {bucket.name}
        </Text>
        <Text textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
          Last Updated: {formatDate(bucket.$updatedAt)}
        </Text>
      </VStack>
    </DangerCard>
  );
};
