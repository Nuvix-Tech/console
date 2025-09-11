"use client";
import React, { PropsWithChildren } from "react";
import { useProjectStore } from "@/lib/store";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { CollectionEditorCollectionStateContextProvider } from "@/lib/store/collection";
import SidePanelEditor from "@/components/project/collection-editor/SidePanelEditor/SidePanelEditor";
import DeleteConfirmationDialogs from "@/components/project/collection-editor/components/_delete_confirmation_dialogs";
import { useRouter } from "@bprogress/next";
import { Tabs } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { Spinner } from "@nuvix/ui/components";
import NotFoundPage from "@/components/others/page-not-found";
import ErrorPage from "@/components/others/page-error";
import { useCollectionEditorQuery } from "@/data/collections";

type Props = PropsWithChildren & {
  collectionId: string;
};

export const CollectionLayout: React.FC<Props> = ({ children, collectionId }) => {
  const { sdk, project } = useProjectStore((s) => s);
  const { selectedSchema } = useQuerySchemaState("doc");
  const router = useRouter();
  const path = usePathname();

  const { data, isPending, error } = useCollectionEditorQuery(
    {
      projectRef: project.$id,
      sdk,
      schema: selectedSchema!,
      id: collectionId,
    },
    {
      enabled: !!sdk && !!selectedSchema && !!collectionId,
    },
  );

  const tabs = [
    { label: "Attributes", value: "attributes" },
    { label: "Indexes", value: "indexes" },
    { label: "Settings", value: "settings" },
  ];

  return (
    <div className="relative">
      <div className="sticky top-0 z-20 bg-(--main-background)">
        <Tabs.Root variant={"line"} size={"sm"} value={path.split("/").filter(Boolean).pop()}>
          <Tabs.List>
            {tabs.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                onClick={() =>
                  router.push(
                    `/project/${project.$id}/database/collections/${collectionId}/${tab.value}?docSchema=${data?.$schema || selectedSchema}`,
                  )
                }
                value={tab.value}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </div>

      {isPending && (
        <div className="flex h-[300px] w-full items-center justify-center">
          <Spinner />
        </div>
      )}

      {error &&
        ((error as any).code === 404 ? (
          <NotFoundPage error={error} />
        ) : (
          <ErrorPage error={error} />
        ))}

      {data && (
        <CollectionEditorCollectionStateContextProvider collection={data} projectRef={project.$id}>
          {children}

          <SidePanelEditor selectedCollection={data} />
          <DeleteConfirmationDialogs
            selectedCollection={data}
            onCollectionDeleted={() => router.push(`/project/${project.$id}/database/collections`)}
          />
        </CollectionEditorCollectionStateContextProvider>
      )}
    </div>
  );
};
