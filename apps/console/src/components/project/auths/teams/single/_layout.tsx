"use client";
import { Avatar } from "@nuvix/cui/avatar";
import { SkeletonText } from "@nuvix/cui/skeleton";
import { useProjectStore, useTeamStore } from "@/lib/store";
import { Column, Line, Row } from "@nuvix/ui/components";
import { SidebarGroup } from "@/ui/layout/navigation";
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
      <Column paddingX="8" fillWidth>
        <Column fillWidth background="neutral-alpha-weak" radius="xs" paddingY="8" gap="16">
          <Row fillWidth paddingX="8">
            <Row vertical="center" gap="12" fillWidth>
              <Avatar size="2xs" src={sdk?.avatars.getInitials(team?.name)} />
              {team ? (
                <Text truncate textStyle={"md"}>
                  {team?.name}
                </Text>
              ) : (
                <SkeletonText noOfLines={1} />
              )}
            </Row>
          </Row>

          <SidebarGroup
            paddingX="4"
            itemProps={{
              size: "s",
            }}
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
              // {
              //   label: "Activity",
              //   href: resolveHref("logs"),
              //   isSelected: resolveIsSelected("logs"),
              // },
            ]}
          />
        </Column>
      </Column>
      <Line />
    </>
  );
};

export default Layout;
