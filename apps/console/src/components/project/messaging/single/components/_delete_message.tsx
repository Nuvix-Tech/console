import { DangerCard } from "@/components/others/danger-card";
import { formatDate } from "@/lib/utils";
import { useConfirm, useToast } from "@nuvix/ui/components";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import { useProjectStore } from "@/lib/store";
import { useMessageStore } from "./store";

export const DeleteMessage = () => {
  const project = useProjectStore.use.project?.();
  const sdk = useProjectStore.use.sdk?.();
  const { message } = useMessageStore((s) => s);

  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { replace } = useRouter();
  const confirm = useConfirm();

  if (!message || !sdk) return;

  const deleteMessage = async (id: string) => {
    if (
      await confirm({
        title: "Delete Message",
        description: "Are you sure you want to delete this file?",
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      try {
        setLoading(true);
        await sdk.messaging.delete(message.$id);
        addToast({
          variant: "success",
          message: "Message deleted successfully",
        });
        replace(`/project/${project?.$id}/messaging`);
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

  const data = message.data as Record<string, string>; // TODO: ----

  return (
    <DangerCard
      title="Delete Message"
      description="The file will be permanently deleted. This action is irreversible."
      actions={
        <Button
          variant={"surface"}
          colorPalette="red"
          loading={loading}
          onClick={() => deleteMessage(message?.$id)}
          loadingText={"Deleting..."}
        >
          Delete
        </Button>
      }
    >
      <VStack alignItems={"flex-start"} gap={0.2}>
        <Text textStyle="md" fontWeight="semibold">
          {data["title"] ?? data["message"]?.slice(0, 30)?.concat("...") ?? message.$id}
        </Text>
        <Text textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
          Last Updated: {formatDate(message.$updatedAt)}
        </Text>
      </VStack>
    </DangerCard>
  );
};
