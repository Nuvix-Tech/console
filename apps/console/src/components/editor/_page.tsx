"use client";
import { useParams, useRouter } from "next/navigation";
import SidePanelEditor from "./SidePanelEditor/SidePanelEditor";

export const EmptyEditor = () => {
  const router = useRouter();
  const { id: projectId } = useParams<{ id: string }>();

  const path = `/project/${projectId}/editor`;

  return (
    <>
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold neutral-on-background-strong mb-2">
            No Table Selected
          </h2>
          <p className="neutral-on-background-weak">
            Select a table from the side panel or create a new one to start editing.
          </p>
        </div>
      </div>
      <SidePanelEditor
        editable={true}
        onTableCreated={(table) => router.push(`${path}/${table.id}`)}
      />
    </>
  );
};
