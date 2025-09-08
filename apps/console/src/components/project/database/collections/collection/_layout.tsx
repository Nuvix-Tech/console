"use client";
import React, { PropsWithChildren } from "react";
import { useProjectStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { CollectionEditorCollectionStateContextProvider } from "@/lib/store/collection";

type Props = PropsWithChildren & {
  databaseId: string;
  collectionId: string;
};

export const CollectionLayout: React.FC<Props> = ({ children, collectionId }) => {
  const { sdk, project } = useProjectStore((s) => s);
  const { selectedSchema } = useQuerySchemaState("doc");

  const fetcher = async () => {
    return await sdk.databases.getCollection(selectedSchema, collectionId);
  };

  const { data, isPending } = useQuery({
    queryKey: ["collection", selectedSchema, collectionId],
    queryFn: fetcher,
    enabled: !!sdk && !!selectedSchema && !!collectionId,
  });

  return (
    <>
      {data && (
        <CollectionEditorCollectionStateContextProvider collection={data} projectRef={project.$id}>
          {children}
        </CollectionEditorCollectionStateContextProvider>
      )}
    </>
  );
};
