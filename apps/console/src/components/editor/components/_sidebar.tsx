import { useGetTables } from "@/data/tables/tables-query";
import { useProjectStore } from "@/lib/store";
import { TableParam } from "@/types";
import { Column, Spinner, ToggleButton } from "@nuvix/ui/components"; // Assuming Loading/ErrorMessage exist
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export const Sidebar = () => (
  <SidebarContent />
);

const SidebarContent = () => {
  const { project, sdk } = useProjectStore();
  const params = useParams<TableParam & { id: string }>();
  const currentTableId = Number(params?.tableId);
  const projectId = params?.id;

  const [tables, setTables] = useState<Awaited<ReturnType<typeof fetchTablesFn>> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTablesFn = useGetTables({
    projectRef: project?.$id,
    sdk,
  });

  useEffect(() => {
    if (!project?.$id || !fetchTablesFn) {
      setTables(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isMounted = true; // Prevent state update on unmounted component

    const loadTables = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedTables = await fetchTablesFn();
        if (isMounted) {
          setTables(fetchedTables);
        }
      } catch (err) {
        console.error("Failed to fetch tables:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("An unknown error occurred"));
          setTables(null); // Clear tables on error
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTables();

    return () => {
      isMounted = false;
    };
  }, [fetchTablesFn, project?.$id]);

  if (isLoading) {
    // Use a suitable loading indicator from your UI library
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="l" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error loading tables: {error.message}</p>
        <button onClick={() => setError(null)} className="mt-2 text-blue-500">Retry</button>
      </div>
    )
  }

  if (!tables || tables.length === 0) {
    return <div className="p-4 text-center text-gray-500">No tables found.</div>;
  }

  return (
    <div className="h-full w-full">
      <Column gap="1" padding="4">
        {tables.map((table) => (
          <ToggleButton
            fillWidth
            size="s"
            justifyContent="flex-start"
            className="truncate line-clamp-1"
            key={table.id}
            truncate
            selected={table.id === currentTableId}
            label={table.name}
            href={projectId ? `/project/${projectId}/editor/${table.id}` : '#'}
          />
        ))}
      </Column>
    </div>
  );
};
