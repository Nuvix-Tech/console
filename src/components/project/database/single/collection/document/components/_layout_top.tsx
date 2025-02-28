import React from "react";
import { Stack } from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react";
import { IDChip, TopCard } from "@/components/others";
import { useRouter } from "@bprogress/next";
import { Row } from "@/ui/components";
import { usePathname } from "next/navigation";
import { getCollectionPageState, getDbPageState, getDocumentPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";

interface LayoutTopProps {
  title: string;
  id?: string;
}

export const LayoutTop: React.FC<LayoutTopProps> = ({ title, id }) => {
  const { project } = getProjectState();
  const { database } = getDbPageState();
  const { collection } = getCollectionPageState();
  const { document } = getDocumentPageState();
  const path = usePathname();
  const { push } = useRouter();

  const url = `/console/project/${project?.$id}/databases/${database?.$id}/collection/${collection?.$id}/document/${document?.$id}`;

  return (
    <>
      <Row margin="20">
        <TopCard minHeight={4}>
          <Stack direction="column" width="full" zIndex="1">
            {title}
            {id && <IDChip id={id} />}
          </Stack>
          <Row fill vertical="end" horizontal="end">
            <Tabs.Root
              variant="enclosed"
              defaultValue="overview"
              value={path.split("/")[-1] ?? "overview"}
              onValueChange={(v) => push(`${url}/${v.value}`)}
            >
              <Tabs.List>
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="data">Data</Tabs.Trigger>
                <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </Row>
        </TopCard>
      </Row>
    </>
  );
};
