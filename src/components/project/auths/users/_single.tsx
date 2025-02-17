"use client";
import { CardUpdater } from "@/components/others/card";
import { Avatar } from "@/components/ui/avatar";
import { SkeletonText } from "@/components/ui/skeleton";
import { getUserPageState, userPageState } from "@/state/page";
import { getProjectState, projectState } from "@/state/project-state";
import { Column, Line, Row } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { Text } from "@chakra-ui/react";
import { Models } from "@nuvix/console";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const UserPage: React.FC<{ id: string }> = ({ id }) => {
  const { user } = getUserPageState();
  const [userState, setUserState] = React.useState<Models.User<any>>();
  const state = getProjectState();
  const { sdk } = state;

  return (
    <>
      <Column fillWidth gap="20" paddingX="12" paddingY="20">
        <CardUpdater
          label="Name"
          button={{
            disabled: user?.name === userState?.name,
          }}
          field={{
            label: "Name",
          }}
          input={{
            placeholder: "Name",
            type: "text",
            value: userState?.name,
            onChange: (e) => {
              setUserState((prev: any) => ({ ...prev, name: e.target.value }));
            },
          }}
          onSubmit={() => sdk?.users.updateName(user?.$id!, userState?.name!)}
        />

        <CardUpdater
          label="Email"
          description="Update user's email. An Email should be formatted as: name@example.com."
          button={{
            disabled: user?.email === userState?.email,
          }}
          field={{
            label: "Email",
          }}
          input={{
            placeholder: "Email",
            type: "email",
            value: userState?.email,
            onChange: (e) => {
              setUserState((prev: any) => ({ ...prev, email: e.target.value }));
            },
          }}
          onSubmit={() => { }}
        />
      </Column>
    </>
  );
};

export default UserPage;
