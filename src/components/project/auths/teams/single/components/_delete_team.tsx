import { DangerCard } from "@/components/others/danger-card";
import { getTeamPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { Avatar, useConfirm, useToast } from "@/ui/components";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import { useState } from "react";

export const DeleteTeam = () => {
  const { team } = getTeamPageState();
  const [loading, setLoading] = useState(false);
  const { sdk, project } = getProjectState();
  const { addToast } = useToast();
  const { replace } = useRouter();
  const confirm = useConfirm();

  const deleteTeam = async (id: string) => {
    if (
      await confirm({
        title: "Delete Team",
        description: "Are you sure you want to delete this team?",
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      try {
        setLoading(true);
        await sdk?.teams.delete(id);
        addToast({
          variant: "success",
          message: "Team deleted successfully",
        });
        replace(`/console/project/${project?.$id}/authentication/teams`);
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
      title="Delete Team"
      description="The team will be permanently deleted, including all data associated with this team. This action is irreversible."
      actions={
        <Button
          variant={"surface"}
          colorPalette="red"
          loading={loading}
          onClick={() => deleteTeam(team?.$id!)}
          loadingText={"Deleting..."}
        >
          Delete
        </Button>
      }
    >
      <Avatar size="l" src={sdk?.avatars.getInitials(team?.name, 120, 120)} />
      <VStack alignItems={"flex-start"} gap={0.2}>
        <Text textStyle="md" fontWeight="semibold">
          {team?.name}
        </Text>
        <Text textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
          {team?.total} Members
        </Text>
      </VStack>
    </DangerCard>
  );
};
