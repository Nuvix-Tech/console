"use client";
import { Column } from "@/ui/components";
import React from "react";
import { DeleteTeam, UpdateName, UpdatePrefs } from "./components";
import { IDChip, TopCard } from "@/components/others";
import { HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { getTeamPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { formatDate } from "@/lib/utils";

interface TeamProps {
  id: string;
}

const SingleTeam: React.FC<TeamProps> = ({ id }) => {
  return (
    <>
      <Column fillWidth gap="20" paddingX="12" paddingY="20">
        <TeamInfo />
        <UpdateName />
        <UpdatePrefs />
        <DeleteTeam />
      </Column>
    </>
  );
};

const TeamInfo = () => {
  const { team } = getTeamPageState();
  const { sdk } = getProjectState();

  return (
    <TopCard minHeight={8}>
      <Stack
        direction={{ base: "column", md: "row" }}
        gap={"2.5"}
        justifyContent={"space-between"}
        width={"full"}
        zIndex={1}
      >
        <VStack
          width={{ base: "full", md: "1/2" }}
          alignItems={"flex-start"}
          justifyContent={"space-between"}
        >
          <HStack alignSelf={"flex-start"} width={"full"}>
            <Avatar
              size={"lg"}
              src={team ? sdk?.avatars.getInitials(team.name, 120, 120) : undefined}
            />
            <Text textStyle={{ base: "xl", mdOnly: "lg" }} fontWeight={"semibold"} truncate>
              {team?.name}
            </Text>
          </HStack>
          <IDChip id={team?.$id} />
        </VStack>
        <VStack width={{ base: "full", md: "1/2" }} alignItems={"flex-start"}>
          {[`${team?.total} Members`, "Created on " + formatDate(team?.$createdAt)]
            .filter(Boolean)
            .map((item, _) => (
              <Text key={_} textStyle={{ base: "sm", mdOnly: "xs" }} color={"fg.muted"} truncate>
                {item}
              </Text>
            ))}
        </VStack>
      </Stack>
    </TopCard>
  );
};

export default SingleTeam;
