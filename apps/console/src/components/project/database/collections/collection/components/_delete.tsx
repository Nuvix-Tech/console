import { DangerCard } from "@/components/others/danger-card";
import { formatDate } from "@/lib/utils";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useProjectStore } from "@/lib/store";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";

export const DeleteCollection = () => {
  const sdk = useProjectStore.use.sdk?.();
  const editorState = useCollectionEditorStore();
  const state = useCollectionEditorCollectionStateSnapshot();
  const collection = state.collection;

  if (!collection || !sdk) return;

  return (
    <DangerCard
      title="Delete Collection"
      description="The collection will be permanently deleted, including all data associated with this collection. This action is irreversible."
      actions={
        <Button
          variant={"surface"}
          colorPalette="red"
          onClick={() => editorState.onDeleteCollection()}
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
