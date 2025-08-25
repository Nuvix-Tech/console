import React from "react";
import { Stack, Text } from "@chakra-ui/react";
import { IDChip, TopCard } from "@/components/others";
import { useRouter } from "@bprogress/next";
import { Row, SegmentedControl } from "@nuvix/ui/components";
import { usePathname } from "next/navigation";
import { formatDate } from "@/lib/utils";
import {
  useCollectionStore,
  useDatabaseStore,
  useDocumentStore,
  useProjectStore,
} from "@/lib/store";

interface LayoutTopProps {
  title: string;
  id?: string;
}

export const LayoutTop: React.FC<LayoutTopProps> = ({ title, id }) => {
  const document = useDocumentStore.use.document?.();
  const collection = useCollectionStore.use.collection?.();
  const database = useDatabaseStore.use.database?.();
  const project = useProjectStore.use.project?.();

  const path = usePathname();
  const { push } = useRouter();

  const url = `/project/${project?.$id}/schema/${database?.$id}/collection/${collection?.$id}/document/${document?.$id}`;
  const value = path.split("/")[path.split("/").length - 1];

  const routes = [
    { value: "", label: "Document" },
    { value: "details", label: "Access & Security" },
    { value: "logs", label: "Activity" },
  ];

  return (
    <>
      <Row marginY="20" fillWidth>
        <TopCard minHeight={4}>
          <Stack direction={{ base: "column-reverse", md: "column" }} width="full" zIndex="1">
            {id && <IDChip id={id} />}
            <SegmentedControl
              fillWidth={false}
              defaultSelected={value === document?.$id ? "" : value}
              buttons={routes.map((r) => ({
                value: r.value,
                label: r.label,
              }))}
              onToggle={(v) => push(`${url}/${v}`)}
            />
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
