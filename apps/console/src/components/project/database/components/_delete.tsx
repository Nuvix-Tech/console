import { DangerCard } from "@/components/others/danger-card";
import { formatDate } from "@/lib/utils";
import { useConfirm, useToast } from "@nuvix/ui/components";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import { useDatabaseStore, useProjectStore } from "@/lib/store";

export const DeleteDatabase = () => {
  const sdk = useProjectStore.use.sdk?.();
  const project = useProjectStore.use.project?.();
  const database = useDatabaseStore.use.database?.();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { replace } = useRouter();
  const confirm = useConfirm();

  if (!database || !sdk) return;

  const deleteDatabase = async (id: string) => {
    if (
      await confirm({
        title: "Delete Database",
        description: "Are you sure you want to delete this database?",
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      try {
        setLoading(true);
        // await sdk.databases.delete(database.$id);
        addToast({
          variant: "success",
          message: "Database deleted",
        });
        replace(`/project/${project?.$id}/d-schema`);
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
      title="Delete Database"
      description="This action is irreversible. All collections and documents will be deleted."
      actions={
        <Button
          variant={"surface"}
          colorPalette="red"
          loading={loading}
          // onClick={() => deleteDatabase(database.$id)}
          loadingText={"Deleting..."}
        >
          Delete
        </Button>
      }
    >
      <VStack alignItems={"flex-start"} gap={0.2}>
        <Text textStyle="md" fontWeight="semibold">
          {database.name}
        </Text>
        <Text textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
          {/* Last Updated: {formatDate(database.$updatedAt)} */}
        </Text>
      </VStack>
    </DangerCard>
  );
};
