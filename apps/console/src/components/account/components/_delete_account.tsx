import { DangerCard } from "@/components/others/danger-card";
import { Avatar, useConfirm, useToast } from "@nuvix/ui/components";
import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { sdkForConsole } from "@/lib/sdk";

export const DeleteAccount = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAppStore((s) => s);
  const { addToast } = useToast();
  const { replace } = useRouter();
  const confirm = useConfirm();

  const deleteUser = async () => {
    if (
      await confirm({
        title: "Delete Account",
        description: "Are you sure you want to delete your account?",
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      try {
        setLoading(true);
        await sdkForConsole?.account.delete();
        addToast({
          variant: "success",
          message: "Account deleted successfully",
        });
        replace(`/auth/login`);
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
      title="Delete account"
      description="Your account will be permanently deleted and access will be lost to any of your teams and data. This action is irreversible."
      actions={
        <Button
          variant={"surface"}
          colorPalette={"red"}
          loading={loading}
          onClick={() => deleteUser()}
          loadingText={"Deleting..."}
        >
          Delete
        </Button>
      }
    >
      <Avatar size="l" src={sdkForConsole?.avatars.getInitials(user?.name, 120, 120)} />
      <Text textStyle="md" fontWeight="semibold">
        {user?.name}
      </Text>
    </DangerCard>
  );
};
