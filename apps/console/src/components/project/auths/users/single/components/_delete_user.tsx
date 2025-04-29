import { DangerCard } from "@/components/others/danger-card";
import { formatDate } from "@/lib/utils";
import { Avatar, useConfirm, useToast } from "@/ui/components";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import { useProjectStore, useUserStore } from "@/lib/store";

export const DeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const project = useProjectStore.use.project?.();
  const sdk = useProjectStore.use.sdk?.();
  const user = useUserStore.use.user?.();
  const { addToast } = useToast();
  const { replace } = useRouter();
  const confirm = useConfirm();

  const deleteUser = async (id: string) => {
    if (
      await confirm({
        title: "Delete User",
        description: "Are you sure you want to delete this user?",
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      try {
        setLoading(true);
        await sdk?.users.delete(id);
        addToast({
          variant: "success",
          message: "User deleted successfully",
        });
        replace(`/project/${project?.$id}/authentication/users`);
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
      title="Delete User"
      description="The user will be permanently deleted, including all data associated with this user. This action is irreversible."
      actions={
        <Button
          variant={"surface"}
          colorPalette={"red"}
          loading={loading}
          onClick={() => deleteUser(user?.$id!)}
          loadingText={"Deleting..."}
        >
          Delete
        </Button>
      }
    >
      <Avatar size="l" src={sdk?.avatars.getInitials(user?.name, 120, 120)} />
      <VStack alignItems={"flex-start"} gap={0.2}>
        <Text textStyle="md" fontWeight="semibold">
          {user?.name}
        </Text>
        {[
          [user?.email, user?.phone].filter(Boolean).join(", "),
          "Last Activity: " + (formatDate(user?.accessedAt) ?? "never"),
        ].map((item, _) => (
          <Text key={_} textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
            {item}
          </Text>
        ))}
      </VStack>
    </DangerCard>
  );
};
