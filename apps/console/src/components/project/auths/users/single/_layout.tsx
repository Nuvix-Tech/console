"use client";
import { Avatar } from "@nuvix/cui/avatar";
import { SkeletonText } from "@nuvix/cui/skeleton";
import { useProjectStore, useUserStore } from "@/lib/store";
import { Column, Line, Row } from "@nuvix/ui/components";
import { SidebarGroup } from "@/ui/layout/navigation";
import { Text } from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

const SingleLayout: React.FC<PropsWithChildren<{ userId: string }>> = ({ children, userId }) => {
  const setSidebar = useProjectStore.use.setSidebar();
  const sdk = useProjectStore.use.sdk?.();
  const setRefreshFn = useUserStore.use.setRefresh();
  const setUser = useUserStore.use.setUser();
  const first = <SidebarAddon userId={userId} />;

  useEffect(() => {
    setSidebar({ first });
    setRefreshFn(async () => {
      setUser(await sdk?.users.get(userId));
    });
  }, []);

  const fetcher = async () => {
    return await sdk.users.get(userId);
  };

  const { data } = useSuspenseQuery({
    queryKey: ["user", userId],
    queryFn: fetcher,
  });

  useEffect(() => {
    setUser(data);
  }, [data]);

  return <>{children}</>;
};

const SidebarAddon = ({ userId }: { userId: string }) => {
  const sdk = useProjectStore.use.sdk?.();
  const project = useProjectStore.use.project?.();
  const user = useUserStore.use.user?.();
  const path = usePathname();

  if (user?.$id !== userId) return;

  const resolveHref = (value?: string) =>
    `/project/${project?.$id}/authentication/users/${userId}${value ? `/${value}` : ""}`;
  const resolveIsSelected = (value?: string) => path.includes(resolveHref(value));

  return (
    <>
      <Column paddingX="8" fillWidth>
        <Column fillWidth background="neutral-alpha-weak" radius="xs" paddingY="8" gap="16">
          <Row fillWidth paddingX="8">
            <Row vertical="center" gap="12" fillWidth>
              <Avatar size="2xs" src={sdk?.avatars.getInitials(user?.name)} />
              {user ? (
                <Text truncate textStyle={"md"}>
                  {user?.name}
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

export default SingleLayout;
