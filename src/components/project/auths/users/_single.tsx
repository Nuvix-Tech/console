"use client";
import { CardUpdater } from "@/components/others/card";
import { Avatar } from "@/components/ui/avatar";
import { SkeletonText } from "@/components/ui/skeleton";
import { getProjectState, projectState } from "@/state/project-state";
import { Column, Line, Row } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { Text } from "@chakra-ui/react";
import { Models } from "@nuvix/console";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const UserPage: React.FC<{ id: string }> = ({ id }) => {
  const [user, setUser] = React.useState<Models.User<any>>();
  const [userState, setUserState] = React.useState<Models.User<any>>();
  const state = getProjectState();
  const { sdk, project } = state;
  const path = usePathname();

  const resolveHref = (value?: string) =>
    `/console/project/${project?.$id}/authentication/users/${id}${value ? `/${value}` : ""}`;
  const resolveIsSelected = (value?: string) => path.includes(resolveHref(value));

  projectState.sidebar.first = (
    <>
      <Row paddingX="xs">
        <Row vertical="center" gap="12" fillWidth>
          <Avatar size="xs" src={sdk?.avatars.getInitials(user?.name)} />
          {user ? (
            <Text truncate textStyle={"lg"}>
              {user?.name}
            </Text>
          ) : (
            <SkeletonText noOfLines={1} />
          )}
        </Row>
      </Row>

      <SidebarGroup
        items={[
          {
            label: "Overview",
            href: resolveHref(),
            isSelected: resolveIsSelected(),
          },
          {
            label: "Memberships",
            href: resolveHref("memberships"),
            isSelected: resolveIsSelected("memberships"),
          },
          {
            label: "Sessions",
            href: resolveHref("sessions"),
            isSelected: resolveIsSelected("sessions"),
          },
          {
            label: "Targets",
            href: resolveHref("targets"),
            isSelected: resolveIsSelected("targets"),
          },
          {
            label: "Identities",
            href: resolveHref("identities"),
            isSelected: resolveIsSelected("identities"),
          },
          {
            label: "Activity",
            href: resolveHref("logs"),
            isSelected: resolveIsSelected("logs"),
          },
        ]}
      />

      <Line />
    </>
  );

  useEffect(() => {
    if (!sdk) return;
    const fetchUser = async () => {
      const user = await sdk.users.get(id);
      setUser(user);
      setUserState(user);
    };

    fetchUser();
  }, [sdk, id]);

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
          onSubmit={() => {}}
        />
      </Column>
    </>
  );
};

export default UserPage;
