import { DangerCard } from "@/components/others/danger-card";
import { sdkForConsole } from "@/lib/sdk";
import { formatDate } from "@/lib/utils";
import { useConfirm, useToast } from "@nuvix/ui/components";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import { useProjectStore } from "@/lib/store";

export const DeleteProject = () => {
  const [loading, setLoading] = useState(false);
  const project = useProjectStore.use.project?.();
  const { projects } = sdkForConsole;
  const { addToast } = useToast();
  const { replace } = useRouter();
  const confirm = useConfirm();

  const deleteProject = async (id: string) => {
    if (
      await confirm({
        title: "Confirm Project Deletion",
        description:
          "Are you sure you want to delete this project? This action cannot be undone and will permanently remove all associated data.",
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      try {
        setLoading(true);
        await projects.delete(id);
        addToast({
          variant: "success",
          message: "Project deleted successfully",
        });
        replace(``);
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
      title="Delete Project"
      description="This action will permanently delete the project, including all associated metadata, resources, and statistics. This action cannot be undone."
      actions={
        <Button
          variant={"surface"}
          colorPalette={"red"}
          loading={loading}
          onClick={() => deleteProject(project?.$id!)}
          loadingText={"Deleting..."}
        >
          Delete
        </Button>
      }
    >
      <VStack alignItems={"flex-start"} gap={0.2}>
        <Text textStyle="md" fontWeight="semibold">
          {project?.name}
        </Text>
        {["Last Updated: " + (formatDate(project?.$updatedAt) ?? "never")].map((item, index) => (
          <Text key={index} textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
            {item}
          </Text>
        ))}
      </VStack>
    </DangerCard>
  );
};
