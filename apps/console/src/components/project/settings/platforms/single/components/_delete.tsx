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

export const DeletePlatform = ({ platform }: { platform?: Models.Platform }) => {
  const [loading, setLoading] = useState(false);
  const project = useProjectStore.use.project?.();
  const { addToast } = useToast();
  const { replace } = useRouter();
  const confirm = useConfirm();

  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: rootKeys.platforms(project?.$id!),
    });
    await queryClient.invalidateQueries({
      queryKey: rootKeys.platform(project?.$id!, platform?.$id!),
    });
  };

  const deletePlatform = async (id: string) => {
    if (
      await confirm({
        title: "Delete Platform",
        description: "Are you sure you want to delete this platform?",
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      try {
        setLoading(true);
        await sdkForConsole.projects.deletePlatform(project?.$id!, platform?.$id!);

        addToast({
          variant: "success",
          message: "Platform deleted successfully",
        });
        replace(`/project/${project?.$id}/s/apps`);
        await refresh();
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
      title="Delete Platform"
      description="Once you delete a platform, there is no going back. Please be certain."
      actions={
        <Button
          variant={"surface"}
          colorPalette={"red"}
          loading={loading}
          onClick={() => deletePlatform(platform?.$id!)}
          loadingText={"Deleting..."}
        >
          Delete
        </Button>
      }
    >
      <VStack alignItems={"flex-start"} gap={0.2}>
        <Text textStyle="md" fontWeight="semibold">
          {platform?.name}
        </Text>
        {["Last Updated: " + (formatDate(platform?.$updatedAt) ?? "never")].map((item, _) => (
          <Text key={_} textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
            {item}
          </Text>
        ))}
      </VStack>
    </DangerCard>
  );
};
