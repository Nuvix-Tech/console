import { getCollectionPageState, getDbPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { Line } from "@/ui/components";
import { SidebarGroup } from "@/ui/modules/layout/navigation";
import { Button, VStack } from "@chakra-ui/react";
import { Models } from "@nuvix/console";
import { usePathname } from "next/navigation";
import { Suspense, use } from "react";

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

      <CollectionsSiderbar />
    </>
  );
};

export const CollectionsSiderbar = () => {
  const { project, sdk } = getProjectState();
  const { database } = getDbPageState();
  const { collection } = getCollectionPageState();
  const path = usePathname();

  if (!sdk || database) return;

  let data = sdk.databases.listCollections(database!.$id);

  const resolveHref = (value?: string) =>
    `/console/project/${project?.$id}/databases/${database!.$id}/collection/${collection?.$id}${value ? `/${value}` : ""}`;
  const resolveIsSelected = (value?: string) => path.includes(resolveHref(value));

  return (
    <>
      <SidebarGroup title="Collections" items={[]} />

      <Suspense fallback="HERE IS THE SKELTON">
        <Collections promiseData={data} />
      </Suspense>

      <Line />
    </>
  );
};

const Collections = ({ promiseData }: { promiseData: Promise<Models.CollectionList> }) => {
  const collections = use(promiseData);

  return (
    <VStack justifyContent={"start"} alignItems={"start"} width="full">
      {collections.collections.map((c) => (
        <Button size="sm" width="full" key={c.$id} justifyContent="flex-start" variant="subtle">
          {c.name}
        </Button>
      ))}
    </VStack>
  );
};

export { CollectionSidebar };
