import { useState } from "react";
import { HStack, Text, VStack, Spinner } from "@chakra-ui/react";
import { Avatar } from "@/components/cui/avatar";
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardRoot,
  HoverCardTrigger,
} from "@/components/cui/hover-card";
import { Models } from "@nuvix/console";
import { sdkForConsole, sdkForProject } from "@/lib/sdk";
import { Line } from "@/ui/components";
import IDChip from "../id";

interface RoleHoverProps {
  role: string;
  sdk: typeof sdkForConsole | typeof sdkForProject;
}

export function RoleHover({ role, sdk }: RoleHoverProps) {
  const [data, setData] = useState<Models.User<any> | Models.Team<any> | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  async function fetchData() {
    if (isFetching || data) return;

    setIsFetching(true);
    const [roleType, id] = role.split(":");
    let result = null;

    try {
      if (roleType === "user") {
        result = await sdk.users.get(id);
      } else if (roleType === "team") {
        result = await sdk.teams.get(id);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setData(result);
      setIsFetching(false);
    }
  }

  if (role === "users") return <Text>Users</Text>;
  if (role === "guests") return <Text>Guests</Text>;
  if (role === "any") return <Text>Any</Text>;

  return (
    <HoverCardRoot>
      <HoverCardTrigger asChild onMouseEnter={fetchData}>
        <Text cursor="pointer" fontWeight="medium" truncate>
          {role}
        </Text>
      </HoverCardTrigger>
      <HoverCardContent>
        <HoverCardArrow />
        {isFetching ? (
          <HStack p={4}>
            <Spinner size="sm" />
          </HStack>
        ) : data ? (
          <VStack align="start" gap={2}>
            <HStack align="center" gap={4} width="full">
              {/* Avatar */}
              {data.name ? <Avatar name={data.name} size="sm" /> : <Avatar size="sm" />}

              {/* User/Team Info */}
              <VStack align="start" gap={1}>
                <Text fontWeight="bold">{data.name || "-"}</Text>
                {"email" in data && data.email && <Text fontSize="sm">Email: {data.email}</Text>}
                {"phone" in data && data.phone && <Text fontSize="sm">Phone: {data.phone}</Text>}
                {"total" in data && <Text fontSize="sm">Members: {data.total}</Text>}
              </VStack>
            </HStack>
            <Line fillWidth />
            <IDChip id={role} />
          </VStack>
        ) : (
          <Text>User/Team Not Found</Text>
        )}
      </HoverCardContent>
    </HoverCardRoot>
  );
}
