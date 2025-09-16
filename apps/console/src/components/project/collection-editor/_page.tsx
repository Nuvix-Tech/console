"use client";

import { useCollectionEditorQuery } from "@/data/collections/collection_query";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { useProjectStore } from "@/lib/store";
import { CollectionEditorCollectionStateContextProvider } from "@/lib/store/collection";
import { useRouter } from "@bprogress/next";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { CollectionGrid } from "./grid";
import SidePanelEditor from "./SidePanelEditor/SidePanelEditor";
import DeleteConfirmationDialogs from "./components/_delete_confirmation_dialogs";
import { SkeletonText } from "@nuvix/cui/skeleton";
import NotFoundPage from "@/components/others/page-not-found";
import ErrorPage from "@/components/others/page-error";

export const CollectionEditor = () => {
  const { collectionId, id: projectRef } = useParams<{ id: string; collectionId: string }>();
  const router = useRouter();
  const { project, sdk } = useProjectStore((s) => s);
  const { selectedSchema } = useQuerySchemaState("doc");

  const {
    data: collection,
    isPending: isLoading,
    isError,
    error,
  } = useCollectionEditorQuery(
    {
      projectRef: project?.$id,
      sdk,
      id: collectionId,
      schema: selectedSchema!,
    },
    { enabled: !!project?.$id && !!collectionId && !!selectedSchema },
  );

  const onTableCreated = useCallback(
    (collection: { $id: string }) => {
      if (project?.$id) {
        router.push(`/project/${project.$id}/collections/${collection.$id}`);
      }
    },
    [project?.$id, router],
  );

  const onTableDeleted = useCallback(async () => {
    try {
      // const tables = await getTables(selectedSchema);
      // const nextTableId = tables.length > 0 ? tables[0].id : undefined;
      // const nextUrl = nextTableId
      //   ? `/project/${projectRef}/editor/${nextTableId}`
      //   : `/project/${projectRef}/editor`;
      router.push(`/project/${projectRef}/collections`);
    } catch (error) {
      console.error("Failed to fetch tables after deletion:", error);
      // Fallback redirect if fetching tables fails
      router.push(`/project/${projectRef}/collections`);
    }
  }, [projectRef, router, selectedSchema]); // getTables

  // --- TODO: Replace hardcoded permissions with actual permission checks ---
  const canEditTables = true; // Example: useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'tables')
  const canEditColumns = true; // Example: useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'columns')
  // ---

  const isReadOnly = !canEditTables && !canEditColumns;
  const canEditViaTableEditor = true;
  const editable = !isReadOnly && canEditViaTableEditor;

  const gridKey = `${selectedSchema}_${collection?.name}_${collectionId}`; // Include tableId for uniqueness

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <SkeletonText noOfLines={4} />
      </div>
    );
  }

  if (isError || !collection) {
    if (error.code === 404) {
      return <NotFoundPage error={error} />;
    }
    return <ErrorPage error={error} />;
  }

  return (
    <>
      <CollectionEditorCollectionStateContextProvider
        // Key ensures context resets when navigating between different tables
        key={`collection-editor-context-${collectionId}`}
        projectRef={projectRef}
        collection={collection}
        editable={editable}
      >
        <CollectionGrid key={gridKey} gridProps={{ height: "100%" }} customHeader={undefined} />

        <SidePanelEditor
          editable={editable}
          selectedCollection={collection}
          onCollectionCreated={onTableCreated}
        />
        <DeleteConfirmationDialogs
          selectedCollection={collection}
          onCollectionDeleted={onTableDeleted}
        />
      </CollectionEditorCollectionStateContextProvider>
    </>
  );
};
