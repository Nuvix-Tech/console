"use client";

import { Avatar } from "@/components/ui/avatar";
import { SkeletonText } from "@/components/ui/skeleton";
import { getProjectState, projectState } from "@/state/project-state";

import { Line, Row } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { Text } from "@chakra-ui/react";

import { Models } from "@nuvix/console";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

export const UserPage: React.FC<{ id: string }> = ({ id }) => {
  const [user, setUser] = React.useState<Models.User<any>>();
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
          {user ? <Text textStyle={"lg"}>{user?.name}</Text> : <SkeletonText noOfLines={1} />}
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
    };

    fetchUser();
  }, [sdk, id]);

  return (
    <>
      <div className="u-flex u-gap-24">
        <Avatar size="lg" src={sdk?.avatars.getInitials(user?.name)} />
        <div className="u-flex u-flex-column">
          <h1 className="u-text-heading-2">{user?.name}</h1>
          <p className="u-text-body-2">{user?.email}</p>
        </div>
      </div>
    </>
  );
};
