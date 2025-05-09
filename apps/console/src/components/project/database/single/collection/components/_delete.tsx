import { DangerCard } from "@/components/others/danger-card";
import { formatDate } from "@/lib/utils";
import { useConfirm, useToast } from "@nuvix/ui/components";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import { useCollectionStore, useDatabaseStore, useProjectStore } from "@/lib/store";

export const DeleteCollection = () => {
  const sdk = useProjectStore.use.sdk?.();
  const project = useProjectStore.use.project?.();
  const collection = useCollectionStore.use.collection?.();
  const database = useDatabaseStore.use.database?.();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { replace } = useRouter();
  const confirm = useConfirm();

  if (!database || !collection || !sdk) return;

  const deleteCollection = async (id: string) => {
    if (
      await confirm({
        title: "Delete Collection",
        description: "Are you sure you want to delete this collection?",
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      try {
        setLoading(true);
        await sdk.databases.deleteCollection(database.$id, id);
        addToast({
          variant: "success",
          message: "Collection deleted successfully",
        });
        replace(`/project/${project?.$id}/schema/${database.$id}`);
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
      title="Delete Collection"
      description="The collection will be permanently deleted, including all data associated with this collection. This action is irreversible."
      actions={
        <Button
          variant={"surface"}
          colorPalette="red"
          loading={loading}
          onClick={() => deleteCollection(collection.$id)}
          loadingText={"Deleting..."}
        >
          Delete
        </Button>
      }
    >
      <VStack alignItems={"flex-start"} gap={0.2}>
        <Text textStyle="md" fontWeight="semibold">
          {collection.name}
        </Text>
        <Text textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
          Last Updated: {formatDate(collection.$updatedAt)}
        </Text>
      </VStack>
    </DangerCard>
  );
};
