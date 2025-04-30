import React from "react";
import { Button, Card } from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react";
import { IDChip } from "@/components/others";
import { useRouter } from "@bprogress/next";

interface HeaderCardProps {
  title: string;
  id?: string;
}

export const HeaderCard: React.FC<HeaderCardProps> = ({ title, id }) => {
  const { push } = useRouter();
  return (
    <>
      <Card.Root variant="subtle" rounded="none">
        <Card.Body gap="2">
          <Card.Title mt="2">{title}</Card.Title>
          {id && (
            <Card.Description>
              <IDChip id={id} />
            </Card.Description>
          )}
        </Card.Body>
        {/* <Card.Footer> */}
        <Tabs.Root variant="line">
          <Tabs.List>
            <Tabs.Trigger value="oerview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="data" onClick={() => push("data")}>
              Data
            </Tabs.Trigger>
            <Tabs.Trigger value="logs">Activity</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        {/* </Card.Footer> */}
      </Card.Root>
    </>
  );
};
