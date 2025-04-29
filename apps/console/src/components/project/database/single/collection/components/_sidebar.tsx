import { Tooltip } from "@/components/cui/tooltip";
import { useCollectionStore, useDatabaseStore, useProjectStore } from "@/lib/store";
import { Button, IconButton, Line, Row, Skeleton } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { useRouter } from "@bprogress/next";
import { VStack } from "@chakra-ui/react";
import { Models } from "@nuvix/console";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CreateCollection } from "../../components";

const CollectionSidebar = () => {
  const project = useProjectStore.use.project?.();
  const collection = useCollectionStore.use.collection?.();
  const database = useDatabaseStore.use.database?.();

  const path = usePathname();

  const resolveHref = (value?: string) =>
    `/project/${project?.$id}/d-schema/${database?.$id}/collection/${collection?.$id}${value ? `/${value}` : ""}`;
  const resolveIsSelected = (value?: string) => path.includes(resolveHref(value));

  return (
    <>
      <SidebarGroup
        title="Collection"
        items={[
          {
            label: "Documents",
            href: resolveHref(),
            isSelected: path === resolveHref(),
          },
          {
            label: "Attributes",
            href: resolveHref("attributes"),
            isSelected: resolveIsSelected("attributes"),
          },
          {
            label: "Indexes",
            href: resolveHref("indexes"),
            isSelected: resolveIsSelected("indexes"),
          },
          {
            label: "Activity",
            href: resolveHref("activity"),
            isSelected: resolveIsSelected("logs"),
          },
          {
            label: "Usage",
            href: resolveHref("usage"),
            isSelected: resolveIsSelected("usage"),
          },
          {
            label: "Settings",
            href: resolveHref("settings"),
            isSelected: resolveIsSelected("settings"),
          },
        ]}
      />

      <Line />
    </>
  );
};

const CollectionsSiderbar = () => {
  const sdk = useProjectStore.use.sdk?.();
  const { canCreateCollections } = useProjectStore.use.permissions()();
  const database = useDatabaseStore.use.database?.();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ["collections-list", database?.$id],
    queryFn: async () => {
      if (!sdk || !database) return;

      return sdk.databases.listCollections(database!.$id);
    },
    enabled: !!sdk && !!database,
  });

  return (
    <>
      <SidebarGroup
        title="Collections"
        action={
          canCreateCollections && (
            <>
              <Tooltip content="Create Collection" showArrow>
                <IconButton
                  variant="secondary"
                  icon="plus"
                  size="s"
                  onClick={() => setIsOpen(true)}
                />
              </Tooltip>
              <CreateCollection isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </>
          )
        }
        items={[]}
      />
      <Collections collections={data?.collections} isPending={isPending} />
      <Line />
    </>
  );
};

const Collections = ({
  collections,
  isPending,
}: { collections?: Models.Collection[]; isPending: boolean }) => {
  const selectedCollection = useCollectionStore.use.collection?.();
  const database = useDatabaseStore.use.database?.();
  const project = useProjectStore.use.project?.();
  const router = useRouter();

  return (
    <VStack justifyContent={"start"} alignItems={"start"} width="full" px="4" gap={1}>
      {isPending
        ? Array.from({ length: 3 }).map((_, i) => (
            <Row key={i} fillWidth height={"24"}>
              <Skeleton shape="block" radius="l" />
            </Row>
          ))
        : collections?.map((c) => (
            <Button
              size="s"
              fillWidth
              key={c.$id}
              justifyContent="flex-start"
              variant={selectedCollection?.$id === c.$id ? "secondary" : "tertiary"}
              onClick={() =>
                router.push(
                  `/project/${project?.$id}/d-schema/${database!.$id}/collection/${c.$id}`,
                )
              }
            >
              {c.name}
            </Button>
          ))}
    </VStack>
  );
};

export { CollectionSidebar, CollectionsSiderbar };
