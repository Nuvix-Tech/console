import { Tooltip } from "@/components/cui/tooltip";
import { getCollectionPageState, getDbPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { IconButton, Line } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { Button, VStack } from "@chakra-ui/react";
import { Models } from "@nuvix/console";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const CollectionSidebar = () => {
  const { project } = getProjectState();
  const { database } = getDbPageState();
  const { collection } = getCollectionPageState();
  const path = usePathname();

  const resolveHref = (value?: string) =>
    `/console/project/${project?.$id}/databases/${database?.$id}/collection/${collection?.$id}${value ? `/${value}` : ""}`;
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
  const { sdk } = getProjectState();
  const { database } = getDbPageState();
  const [collections, setCollections] = useState<Models.Collection[]>([]);

  useEffect(() => {
    if (!sdk || !database) return;

    sdk.databases.listCollections(database!.$id).then((data) => {
      setCollections(data.collections);
    });
  }, [sdk, database]);

  return (
    <>
      <SidebarGroup
        title="Collections"
        action={
          <Tooltip content="Create Collection" showArrow>
            <IconButton variant="secondary" icon="plus" size="s" />
          </Tooltip>
        }
        items={[]}
      />
      <Collections collections={collections} />
      <Line />
    </>
  );
};

const Collections = ({ collections }: { collections: Models.Collection[] }) => {
  const { project } = getProjectState();
  const { database } = getDbPageState();
  const { collection: selectedCollection } = getCollectionPageState();
  const path = usePathname();
  const router = useRouter();

  return (
    <VStack justifyContent={"start"} alignItems={"start"} width="full" px="4">
      {collections.map((c) => (
        <Button
          size="sm"
          width="full"
          key={c.$id}
          justifyContent="flex-start"
          variant={selectedCollection?.$id === c.$id ? "surface" : "plain"}
          onClick={() =>
            router.push(
              `/console/project/${project?.$id}/databases/${database!.$id}/collection/${c.$id}`,
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
