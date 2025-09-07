import { sdkForConsole } from "@/lib/sdk";
import { useAppStore } from "@/lib/store";
import { ThemeSwitcher } from "@/ui/ThemeSwitcher";
import { UserMenu, Row, Option, Text, Icon, useConfirm } from "@nuvix/ui/components";
import React from "react";
import { toast } from "sonner";

export function UserProfile(props: Partial<React.ComponentProps<typeof UserMenu>>) {
  const user = useAppStore.use.user();
  const { avatars, account } = sdkForConsole;
  const confirm = useConfirm();

  async function signOut() {
    const confirmed = await confirm({
      title: "Sign out",
      description: "Are you sure you want to sign out?",
      confirm: {
        text: "Sign out",
        variant: "danger",
      },
      cancel: {
        text: "Cancel",
        variant: "tertiary",
      },
    });

    if (!confirmed) return;
    try {
      await account.deleteSession("current");
      window.location.href = "/auth/login";
    } catch (error: any) {
      toast.error(`Error signing out: ${error?.message}`);
    }
  }

  return (
    <Row position="relative" vertical="center">
      <UserMenu
        minWidth={12}
        {...props}
        avatarProps={{
          ...props.avatarProps,
          empty: !user,
          src: avatars.getInitials(user.name, 100, 100),
        }}
        loading={!user}
        dropClass="!z-[999]"
        className="!z-[999]"
        dropdown={
          <>
            <div className="px-4 py-2 border-b mb-2">
              <Text onBackground="neutral-medium">{user.email}</Text>
            </div>
            <Option
              label="Account"
              value="0"
              hasPrefix={<Icon name="account" size="s" />}
              href="/account"
            />
            <Option
              label="Create Organization"
              value="2"
              hasPrefix={<Icon name="team" size="s" />}
              href="/create-organization"
            />
            <Option
              label="Sign out"
              hasPrefix={<Icon name="logout" size="s" />}
              onClick={() => signOut()}
              value="3"
            />
            <div className="flex items-center mb-2 pr-2">
              <Option
                label="Theme"
                hasPrefix={<Icon name="minus" size="s" />}
                onClick={() => signOut()}
                value="4"
                className="flex-1 pointer-events-none !border-none"
              />
              <ThemeSwitcher />
            </div>
          </>
        }
      />
    </Row>
  );
}
