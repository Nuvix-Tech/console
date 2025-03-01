import { Stack } from "@chakra-ui/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card className="border-red-600">
        <CardContent>
          <Stack
            direction={{ base: "column", mdOnly: "column", lg: "row" }}
            gap={4}
            justifyContent={"space-between"}
          >
            <Stack direction={"column"} maxW={{ base: "full", mdOnly: "full", lg: "5/12" }}>
              <CardTitle >{props.title}</CardTitle>
              <CardDescription>{props.description}</CardDescription>
            </Stack>
            <TheCard radius="m-4" padding="12" gap="20" direction="row" vertical="center" fillWidth>
              {children}
            </TheCard>
          </Stack>
        </CardContent>
        {actions ? (
          <>
            <CardFooter>{actions}</CardFooter>
          </>
        ) : null}
      </Card>
    </>
  );
}
