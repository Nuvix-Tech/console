import React from "react";
import { Stack, Text } from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react";
import { IDChip, TopCard } from "@/components/others";
import { useRouter } from "@bprogress/next";
import { Row } from "@/ui/components";
import { usePathname } from "next/navigation";
import { getCollectionPageState, getDbPageState, getDocumentPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { formatDate } from "@/lib/utils";

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
            {id && <IDChip id={id} />}
            <Tabs.Root
              variant="plain"
              defaultValue=""
              value={path.split("/")[path.split("/").length - 1] || ""}
              onValueChange={(v) => push(`${url}/${v.value}`)}
            >
              <Tabs.List>
                <Tabs.Trigger value="">Overview</Tabs.Trigger>
                <Tabs.Trigger value="data">Data</Tabs.Trigger>
                <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </Stack>

          <Stack direction="column" width="full" zIndex="1" align="end" justify="end">
            <Text color="fg.muted" textStyle="sm">
              Created: {formatDate(document?.$createdAt)}
            </Text>
            <Text color="fg.muted" textStyle="sm">
              Last updated: {formatDate(document?.$updatedAt)}
            </Text>
          </Stack>
        </TopCard>
      </Row>
    </>
  );
};
