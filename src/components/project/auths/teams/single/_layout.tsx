"use client";
import { Avatar } from "@/components/cui/avatar";
import { SkeletonText } from "@/components/cui/skeleton";
import { getTeamPageState, teamPageState } from "@/state/page";
import { getProjectState, projectState } from "@/state/project-state";
import { Line, Row } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { Text } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

const Layout: React.FC<PropsWithChildren<{ teamId: string }>> = ({ children, teamId }) => {
  const { sdk } = getProjectState();
  teamPageState._update = async () => {
    teamPageState.team = await sdk?.teams.get(teamId)!;
  };
  projectState.sidebar.first = <SidebarAddon teamId={teamId} />;

  useEffect(() => {
    if (!sdk) return;
    const fetchTeam = async () => {
      const team = await sdk.teams.get(teamId);
      teamPageState.team = team;
    };

    fetchTeam();
  }, [sdk, teamId]);

  return <>{children}</>;
};

const SidebarAddon = ({ teamId }: { teamId: string }) => {
  const { sdk, project } = getProjectState();
  const { team } = getTeamPageState();
  const path = usePathname();

  if (team?.$id !== teamId) return;

  const resolveHref = (value?: string) =>
    `/console/project/${project?.$id}/authentication/teams/${teamId}${value ? `/${value}` : ""}`;
  const resolveIsSelected = (value?: string) => path.includes(resolveHref(value));

  return (
    <>
      <Row paddingX="xs">
        <Row vertical="center" gap="12" fillWidth>
          <Avatar size="xs" src={sdk?.avatars.getInitials(team?.name)} />
          {team ? (
            <Text truncate textStyle={"lg"}>
              {team?.name}
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
            isSelected: path === resolveHref(),
          },
          {
            label: "Members",
            href: resolveHref("members"),
            isSelected: resolveIsSelected("members"),
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
};

export default Layout;
