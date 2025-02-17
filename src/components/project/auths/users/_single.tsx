"use client";
import { IDChip, TopCard, UserStatus } from "@/components/others";
import { CardUpdater } from "@/components/others/card";
import { Avatar } from "@/components/ui/avatar";
import { SkeletonText } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { getUserPageState, userPageState } from "@/state/page";
import { getProjectState, projectState } from "@/state/project-state";
import { Background, Column, Line, Row } from "@/ui/components";
import { Button, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { Models } from "@nuvix/console";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";

const UserPage: React.FC<{ id: string }> = ({ id }) => {
  const { user } = getUserPageState();
  const [userState, setUserState] = React.useState<Models.User<any>>();
  const state = getProjectState();
  const { sdk } = state;

  return (
    <>
      <Column fillWidth gap="20" paddingX="12" paddingY="20">
        <TopCard>
          <Row
            fill
            background="neutral-alpha-weak"
            radius="l"
            padding="20"
            horizontal="space-between"
          >
            <Stack
              direction={{ base: "column", md: "row" }}
              gap={"2.5"}
              justifyContent={"space-between"}
              width={"full"}
            >
              <VStack
                width={{ base: "full", md: "1/2" }}
                alignItems={"flex-start"}
                justifyContent={"space-between"}
              >
                <HStack alignSelf={"flex-start"} width={"full"}>
                  <Avatar
                    size={"lg"}
                    src={user ? sdk?.avatars.getInitials(user.name, 120, 120) : undefined}
                  />
                  <Text textStyle={{ base: "xl", mdOnly: "lg" }} fontWeight={"semibold"} truncate>
                    {user?.name}
                  </Text>
                </HStack>
                <IDChip id={user?.$id} />
              </VStack>
              <VStack width={{ base: "full", md: "1/2" }} alignItems={"flex-start"}>
                {[
                  user?.email,
                  "Joined: " + formatDate(user?.$createdAt),
                  "Last Activity: " + (formatDate(user?.accessedAt) ?? "never"),
                ].map((item, _) => (
                  <Text
                    key={_}
                    textStyle={{ base: "sm", mdOnly: "xs" }}
                    color={"fg.muted"}
                    truncate
                  >
                    {item}
                  </Text>
                ))}
              </VStack>
            </Stack>
          </Row>
          <VStack
            width={{ base: "full", lg: "1/3" }}
            alignItems={"flex-end"}
            justifyContent={"space-between"}
          >
            {user && <UserStatus variant={"surface"} size={"lg"} user={user!} />}
            <Stack
              direction={{ base: "row", lg: "column" }}
              gap={"2"}
              alignItems={"flex-end"}
              width={"full"}
            >
              <Button variant={"outline"} width={{ base: "1/2", lg: "full" }}>
                Block User
              </Button>
              <Button variant={"solid"} width={{ base: "1/2", lg: "full" }}>
                Verify Account
              </Button>
            </Stack>
          </VStack>
        </TopCard>

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
