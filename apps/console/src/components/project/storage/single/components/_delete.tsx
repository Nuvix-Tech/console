import { DangerCard } from "@/components/others/danger-card";
import { formatDate } from "@/lib/utils";
import { useConfirm, useToast } from "@/ui/components";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import { useBucketStore, useFileStore, useProjectStore } from "@/lib/store";

export const DeleteFile = () => {
  const file = useFileStore.use.file?.();
  const project = useProjectStore.use.project?.();
  const sdk = useProjectStore.use.sdk?.();
  const bucket = useBucketStore.use.bucket?.();

  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { replace } = useRouter();
  const confirm = useConfirm();

  if (!bucket || !file || !sdk) return;

  const deleteFile = async (id: string) => {
    if (
      await confirm({
        title: "Delete File",
        description: "Are you sure you want to delete this file?",
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      try {
        setLoading(true);
        await sdk.storage.deleteFile(bucket.$id, id);
        addToast({
          variant: "success",
          message: "File deleted successfully",
        });
        replace(`/project/${project?.$id}/buckets/${bucket.$id}`);
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
      title="Delete File"
      description="The file will be permanently deleted. This action is irreversible."
      actions={
        <Button
          variant={"surface"}
          colorPalette="red"
          loading={loading}
          onClick={() => deleteFile(file?.$id)}
          loadingText={"Deleting..."}
        >
          Delete
        </Button>
      }
    >
      <VStack alignItems={"flex-start"} gap={0.2}>
        <Text textStyle="md" fontWeight="semibold">
          {file.name}
        </Text>
        <Text textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
          Last Updated: {formatDate(file.$updatedAt)}
        </Text>
      </VStack>
    </DangerCard>
  );
};
