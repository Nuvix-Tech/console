"use client";
import { Avatar } from "@/components/cui/avatar";
import { SkeletonText } from "@/components/cui/skeleton";
import { useProjectStore, useTeamStore } from "@/lib/store";
import { Line, Row } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { Text } from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

const Layout: React.FC<PropsWithChildren<{ teamId: string }>> = ({ children, teamId }) => {
  const sdk = useProjectStore.use.sdk?.();
  const setSidebar = useProjectStore.use.setSidebar();
  const setRefreshFn = useTeamStore.use.setRefresh();
  const setTeam = useTeamStore.use.setTeam();

  const first = <SidebarAddon teamId={teamId} />;

  useEffect(() => {
    setSidebar({ first });
    setRefreshFn(async () => {
      setTeam(await sdk?.teams.get(teamId));
    });
  }, []);

  const fetcher = async () => {
    return await sdk.teams.get(teamId);
  };

  const { data } = useSuspenseQuery({
    queryKey: ["team", teamId],
    queryFn: fetcher,
  });

  useEffect(() => {
    setTeam(data);
  }, [data]);

  return <>{children}</>;
};

const SidebarAddon = ({ teamId }: { teamId: string }) => {
  const sdk = useProjectStore.use.sdk?.();
  const team = useTeamStore.use.team?.();
  const project = useProjectStore.use.project?.();
  const path = usePathname();

  if (team?.$id !== teamId) return;

  const resolveHref = (value?: string) =>
    `/project/${project?.$id}/authentication/teams/${teamId}${value ? `/${value}` : ""}`;
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
