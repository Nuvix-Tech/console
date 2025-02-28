"use client";

import { sdkForConsole } from "@/lib/sdk";
import { Badge, Column, Logo, NavIcon, Row, ToggleButton } from "@/ui/components";
import { usePathname } from "next/navigation";
import { useRouter } from "@bprogress/next";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, HStack, Stack, Text, createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/cui/select";
import { appState, getAppState } from "@/state/app-state";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/cui/drawer";
import { FirstSidebar, SecondSidebar } from "./sidebar";
import { Models } from "@nuvix/console";
import { getProjectState } from "@/state/project-state";

interface HeaderProps {
  authenticated?: boolean;
  avatar?: string;
  name?: string;
  subline?: string;
}

const ProjectHeader: React.FC<HeaderProps> = () => {
  const { organization, isDrawerOpen, isSecondMenuOpen, user } = getAppState();
  const { avatars } = sdkForConsole;
  const pathname = usePathname() ?? "";
  const headerRef = useRef<any>(null);

  return (
    <>
      <Row
        hide="s"
        as="header"
        borderBottom="neutral-medium"
        fillWidth
        position="fixed"
        zIndex={10}
        style={{
          zIndex: 9999,
        }}
        gap="12"
        paddingX="m"
        height="64"
        vertical="center"
        background="surface"
        ref={headerRef}
      >
        <Row>
          <div className="is-only-dark">
            <Logo icon={false} size="s" wordmarkSrc="/trademark/nuvix-logo-dark.svg" />
          </div>
          <div className="is-only-light">
            <Logo icon={false} size="s" wordmarkSrc="/trademark/nuvix-logo-light.svg" />
          </div>
        </Row>
        <Badge
          effect
          hide="s"
          arrow={false}
          paddingX="16"
          paddingY="4"
          title="DEV"
          horizontal="center"
        />
        <Row fillWidth vertical="center" horizontal="space-between">
          <Row vertical="center" gap={"8"}>
            <OrganizationSelector ref={headerRef} />
            <span>/</span>
            <ProjectSelector ref={headerRef} />
          </Row>
          <Row fillWidth>
            <Row fillWidth gap="4" paddingX="l" vertical="center">
              <ToggleButton selected={pathname === "/apps"} label="Support" />
              <ToggleButton selected={pathname === "/resources"} label="Feedback" />
            </Row>
          </Row>
          <Row as="nav">
            <Row minWidth={10}>
              <HStack key={user?.email} gap="4">
                <Avatar.Root size={"sm"}>
                  <Avatar.Fallback name={user?.name} />
                  <Avatar.Image src={avatars.getInitials(user?.name, 96, 96)} />
                </Avatar.Root>
                <Stack gap="0">
                  <Text textStyle={"sm"} fontWeight="medium">
                    {user?.name}
                  </Text>
                  <Text color="fg.muted" textStyle="sm">
                    {organization?.name}
                  </Text>
                </Stack>
              </HStack>
            </Row>
          </Row>
        </Row>
      </Row>

      <Column
        show="s"
        as="header"
        borderBottom="neutral-medium"
        position="fixed"
        fillWidth
        zIndex={10}
        height="80"
        background="surface"
      >
        <Row fillWidth vertical="center" height="48" paddingX="m" borderBottom="neutral-weak">
          <Row gap="4" vertical="center">
            <Logo wordmark={false} size="l" iconSrc="/trademark/nuvix.svg" />
          </Row>
          <Badge hide="s" effect arrow={false}>
            DEV
          </Badge>
          <Row fillWidth vertical="center" horizontal="end">
            <Row as="nav">
              <Row>
                <NavIcon
                  isActive={isDrawerOpen}
                  onClick={() => (appState.isDrawerOpen = !appState.isDrawerOpen)}
                />
                {/* <Avatar.Root size={'sm'}>
                  <Avatar.Fallback name={user?.name} />
                  <Avatar.Image src={avatars.getInitials(user?.name, 96, 96)} />
                </Avatar.Root> */}
              </Row>
            </Row>
          </Row>
        </Row>

        <Row fillWidth vertical="center" height="32" paddingX="m">
          <Row gap="4" vertical="center">
            <NavIcon
              isActive={isSecondMenuOpen}
              onClick={() => (appState.isSecondMenuOpen = !appState.isSecondMenuOpen)}
            />
            {organization?.name}
          </Row>
          <Badge hide="s" effect arrow={false}>
            DEV
          </Badge>
          <Row fillWidth vertical="center" horizontal="end">
            <Row as="nav">
              <Row>
                {/* <Avatar.Root size={'sm'}>
                  <Avatar.Fallback name={user?.name} />
                  <Avatar.Image src={avatars.getInitials(user?.name, 96, 96)} />
                </Avatar.Root> */}
              </Row>
            </Row>
          </Row>
        </Row>
      </Column>

      <DrawerRoot open={isDrawerOpen} onOpenChange={(e) => (appState.isDrawerOpen = e.open)}>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerBody>
            <FirstSidebar alwaysFull noBg border={false} />
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>

      <DrawerRoot
        open={isSecondMenuOpen}
        onOpenChange={(e) => (appState.isSecondMenuOpen = e.open)}
        placement="bottom"
      >
        <DrawerBackdrop />
        <DrawerContent offset="4" rounded="md">
          <DrawerBody>
            <SecondSidebar noBg noMarg border={false} />
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

ProjectHeader.displayName = "Header";

const OrganizationSelector = ({ ref }: { ref: any }) => {
  const { organization } = getAppState();
  const { organizations: orgApi } = sdkForConsole;
  const [orgs, setOrgs] = useState<Models.Organization<any>[]>();
  const { push } = useRouter();

  useEffect(() => {
    async function getAll() {
      const orgs = await orgApi.list<any>();
      setOrgs(orgs.teams);
    }
    getAll();
  }, []);

  const organizations = useMemo(() => {
    return createListCollection({
      items: orgs || [],
      itemToString: (item) => item.name,
      itemToValue: (item) => item.$id,
    });
  }, [orgs]);

  return (
    <>
      <SelectRoot
        collection={organizations}
        size="xs"
        width="150px"
        value={[organization?.$id]}
        onValueChange={(e) => {
          push(`/console/organizations/${e.value[0]}`);
        }}
      >
        <SelectTrigger>
          <SelectValueText placeholder="Organization" />
        </SelectTrigger>
        <SelectContent portalRef={ref}>
          {organizations.items.map((org) => (
            <SelectItem item={org} key={org.name}>
              {org.name}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </>
  );
};

const ProjectSelector = ({ ref }: { ref: any }) => {
  const { project } = getProjectState();
  const { projects: projectApi } = sdkForConsole;
  const [projects, setProjects] = useState<Models.Project[]>();
  const { push } = useRouter();

  useEffect(() => {
    async function getAll() {
      const projects = await projectApi.list();
      setProjects(projects.projects);
    }
    getAll();
  }, []);

  const projectsColl = useMemo(() => {
    return createListCollection({
      items: projects || [],
      itemToString: (item) => item.name,
      itemToValue: (item) => item.$id,
    });
  }, [projects]);

  return (
    <>
      <SelectRoot
        collection={projectsColl}
        size="xs"
        width="150px"
        value={[project?.$id ?? ""]}
        onValueChange={(e) => {
          push(`/console/project/${e.value[0]}`);
        }}
      >
        <SelectTrigger>
          <SelectValueText placeholder="Project" />
        </SelectTrigger>
        <SelectContent portalRef={ref}>
          {projectsColl.items.map((proj) => (
            <SelectItem item={proj} key={proj.name}>
              {proj.name}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </>
  );
};

export { ProjectHeader };
