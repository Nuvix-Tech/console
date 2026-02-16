import { Stack } from "@chakra-ui/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@nuvix/sui/components/card";
import { Card as TheCard } from "@nuvix/ui/components";
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
      <Card className="bg-[var(--neutral-background-medium)] dark:bg-[var(--neutral-alpha-weak)] border-0 danger-border-alpha-medium border-b shadow-none">
        <CardContent>
          <Stack
            direction={{ base: "column", mdOnly: "column", lg: "row" }}
            gap={4}
            justifyContent={"space-between"}
          >
            <Stack direction={"column"} maxW={{ base: "full", mdOnly: "full", lg: "5/12" }}>
              <CardTitle>{props.title}</CardTitle>
              <CardDescription>{props.description}</CardDescription>
            </Stack>
            <TheCard radius="m-4" padding="12" gap="20" direction="row" vertical="center" fillWidth>
              {children}
            </TheCard>
          </Stack>
        </CardContent>
        {actions ? (
          <>
            <CardFooter className="justify-end">{actions}</CardFooter>
          </>
        ) : null}
      </Card>
    </>
  );
}
