import React from "react";
import { Stack, Text } from "@chakra-ui/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const url = `/project/${project?.$id}/databases/${database?.$id}/collection/${collection?.$id}/document/${document?.$id}`;

  const value = path.split("/")[path.split("/").length - 1];
  return (
    <>
      <Row margin="20">
        <TopCard minHeight={4}>
          <Stack direction={{ base: "column-reverse", md: "column" }} width="full" zIndex="1">
            {id && <IDChip id={id} />}
            <Tabs
              defaultValue={""}
              value={value === document?.$id ? "" : value}
              onValueChange={(v) => push(`${url}/${v}`)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value={""}>Document</TabsTrigger>
                <TabsTrigger value={`details`}>Access & Security</TabsTrigger>
                <TabsTrigger value={`logs`}>Activity</TabsTrigger>
              </TabsList>
            </Tabs>
          </Stack>

          <Stack
            direction="column"
            width="full"
            zIndex="1"
            align={{ base: "start", lg: "end" }}
            justify={{ base: "start", lg: "end" }}
          >
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
