import { sdkForConsole } from "@/lib/sdk";
import { useAppStore } from "@/lib/store";
import { ThemeSwitcher } from "@/ui/ThemeSwitcher";
import { UserMenu, Row, Option } from "@nuvix/ui/components";
import React from "react";

export function UserProfile(props: Partial<React.ComponentProps<typeof UserMenu>>) {
  const user = useAppStore.use.user();
  const { avatars, account } = sdkForConsole;

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
            <Option label="Dashboard" value="0" />
            <Option label="Your Account" value="1" />
            <Option label="Create Team" value="2" />
            <Option
              label="Log out"
              onClick={() => account.deleteSession("current").then()}
              value="3"
            />
            <div className="px-4 py-2 mx-auto">
              <ThemeSwitcher />
            </div>
          </>
        }
      />
    </Row>
  );
}
