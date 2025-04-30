import { DangerCard } from "@/components/others/danger-card";
import { formatDate } from "@/lib/utils";
import { useConfirm, useToast } from "@nuvix/ui/components";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import {
  useCollectionStore,
  useDatabaseStore,
  useDocumentStore,
  useProjectStore,
} from "@/lib/store";

export const DeleteDocument = () => {
  const document = useDocumentStore.use.document?.();
  const project = useProjectStore.use.project?.();
  const sdk = useProjectStore.use.sdk?.();
  const collection = useCollectionStore.use.collection?.();
  const database = useDatabaseStore.use.database?.();

  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { replace } = useRouter();
  const confirm = useConfirm();

  if (!database || !collection || !document || !sdk) return;

  const deleteDocument = async (id: string) => {
    if (
      await confirm({
        title: "Delete Document",
        description: "Are you sure you want to delete this document?",
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      try {
        setLoading(true);
        await sdk.databases.deleteDocument(database.$id, collection.$id, id);
        addToast({
          variant: "success",
          message: "Document deleted successfully",
        });
        replace(`/project/${project?.$id}/d-schema/${database.$id}/collection/${collection.$id}`);
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
      title="Delete Document"
      description="The document will be permanently deleted, including all data associated with this document. This action is irreversible."
      actions={
        <Button
          variant={"surface"}
          colorPalette="red"
          loading={loading}
          onClick={() => deleteDocument(document.$id)}
          loadingText={"Deleting..."}
        >
          Delete
        </Button>
      }
    >
      <VStack alignItems={"flex-start"} gap={0.2}>
        <Text textStyle="md" fontWeight="semibold">
          {document.$id}
        </Text>
        <Text textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
          Last Updated: {formatDate(document.$updatedAt)}
        </Text>
      </VStack>
    </DangerCard>
  );
};
