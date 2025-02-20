import { Card, Separator, Stack, Text } from "@chakra-ui/react";
import { Card as TheCard } from "@/ui/components";
import React from "react";

interface DangerCardProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function DangerCard(props: DangerCardProps) {
  const { children, actions } = props;

  return (
    <>
      <Card.Root variant={"outline"} borderColor={{ _light: "red.400", _dark: "red.700" }}>
        <Card.Body>
          <Stack
            direction={{ base: "column", mdOnly: "column", lg: "row" }}
            gap={4}
            justifyContent={"space-between"}
          >
            <Stack direction={"column"} maxW={{ base: "full", mdOnly: "full", lg: "5/12" }}>
              <Card.Title color={"red.500"}>{props.title}</Card.Title>
              <Text textStyle={"sm"}>{props.description}</Text>
            </Stack>
            <TheCard radius="m-4" padding="12" gap="20" direction="row" vertical="center" fillWidth>
              {children}
            </TheCard>
          </Stack>
        </Card.Body>
        {actions ? (
          <>
            <Separator
              variant={"dashed"}
              paddingBottom={"6"}
              borderColor={{ _light: "red.400", _dark: "red.700" }}
            />
            <Card.Footer justifyContent={"flex-end"}>{actions}</Card.Footer>
          </>
        ) : null}
      </Card.Root>
    </>
  );
}
