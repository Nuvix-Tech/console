import { DangerCard } from "@/components/others/danger-card";
import { Avatar, useConfirm, useToast } from "@nuvix/ui/components";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { sdkForConsole } from "@/lib/sdk";

export const DeleteOrg = () => {
  const [loading, setLoading] = useState(false);
  const { organization } = useAppStore((s) => s);
  const { addToast } = useToast();
  const { replace } = useRouter();
  const confirm = useConfirm();

  const deleteTeam = async (id: string) => {
    if (
      await confirm({
        title: "Delete Organization",
        description: "Are you sure you want to delete this organization?",
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      try {
        setLoading(true);
        await sdkForConsole?.organizations.delete(id);
        addToast({
          variant: "success",
          message: "Organization deleted successfully",
        });
        replace(`/`);
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
      title="Delete Organization"
      description="The organization will be permanently deleted, including all data associated with this organization. This action is irreversible."
      actions={
        <Button
          variant={"surface"}
          colorPalette="red"
          loading={loading}
          onClick={() => deleteTeam(organization?.$id!)}
          loadingText={"Deleting..."}
        >
          Delete
        </Button>
      }
    >
      <Avatar size="l" src={sdkForConsole?.avatars.getInitials(organization?.name, 120, 120)} />
      <VStack alignItems={"flex-start"} gap={0.2}>
        <Text textStyle="md" fontWeight="semibold">
          {organization?.name}
        </Text>
        <Text textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
          {organization?.total} Members
        </Text>
      </VStack>
    </DangerCard>
  );
};
