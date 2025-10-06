import { DangerCard } from "@/components/others/danger-card";
import { formatDate } from "@/lib/utils";
import { useConfirm, useToast } from "@nuvix/ui/components";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import { useProjectStore } from "@/lib/store";
import { Models } from "@nuvix/console";
import { sdkForConsole } from "@/lib/sdk";
import { useQueryClient } from "@tanstack/react-query";
import { rootKeys } from "@/lib/keys";

interface DeleteApiKeyProps {
  apiKey: Models.Key;
}

export const DeleteApiKey = ({ apiKey }: DeleteApiKeyProps) => {
  const [loading, setLoading] = useState(false);
  const project = useProjectStore.use.project?.();
  const { addToast } = useToast();
  const { replace } = useRouter();
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const refresh = async () => {
    if (!project) return;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: rootKeys.keys(project.$id) }),
      queryClient.invalidateQueries({ queryKey: rootKeys.key(project.$id, apiKey.$id) }),
    ]);
  };

  const deleteKey = async () => {
    if (!project) return;

    const confirmed = await confirm({
      title: "Delete API Key",
      description:
        "Are you sure you want to permanently delete this API key? This action cannot be undone.",
      confirm: { text: "Delete", variant: "danger" },
    });

    if (!confirmed) return;

    try {
      setLoading(true);
      await sdkForConsole.projects.deleteKey(project.$id, apiKey.$id);

      addToast({
        variant: "success",
        message: "API key deleted successfully.",
      });

      replace(`/project/${project.$id}/s/keys`);
      await refresh();
    } catch (e: any) {
      addToast({
        variant: "danger",
        message: e?.message || "Failed to delete API key. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const accessedAt = apiKey.accessedAt ? formatDate(apiKey.accessedAt) : "Never";

  return (
    <DangerCard
      title="Delete API Key"
      description="Once you delete this API key, it cannot be recovered. Ensure this key is no longer in use before deleting."
      actions={
        <Button
          variant="surface"
          colorPalette="red"
          loading={loading}
          onClick={deleteKey}
          loadingText="Deleting..."
        >
          Delete
        </Button>
      }
    >
      <VStack align="flex-start" gap={1}>
        <Text textStyle="md" fontWeight="semibold">
          {apiKey.name || "Unnamed API Key"}
        </Text>
        <Text textStyle={{ base: "sm", mdOnly: "xs" }} color="fg.muted">
          Last Accessed: {accessedAt}
        </Text>
      </VStack>
    </DangerCard>
  );
};
