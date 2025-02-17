"use client";
import { Avatar } from "@/components/ui/avatar";
import { SkeletonText } from "@/components/ui/skeleton";
import { getUserPageState, userPageState } from "@/state/page";
import { getProjectState, projectState } from "@/state/project-state";
import { Line, Row } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { Text } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

const SingleLayout: React.FC<PropsWithChildren<{ userId: string }>> = ({ children, userId }) => {
  const { sdk } = getProjectState();
  projectState.sidebar.first = <SidebarAddon userId={userId} />;

  useEffect(() => {
    if (!sdk) return;
    const fetchUser = async () => {
      const user = await sdk.users.get(userId);
      userPageState.user = user;
    };

    fetchUser();
  }, [sdk, userId]);

  return (
    <>
      {children}
    </>
  );
};

const SidebarAddon = ({ userId }: { userId: string }) => {
  const { sdk, project } = getProjectState();
  const { user } = getUserPageState();
  const path = usePathname();

  const resolveHref = (value?: string) =>
    `/console/project/${project?.$id}/authentication/users/${userId}${value ? `/${value}` : ""}`;
  const resolveIsSelected = (value?: string) => path.includes(resolveHref(value));

  return (
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
}

export default SingleLayout;
