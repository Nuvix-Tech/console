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
        <div className="text-center max-w-md p-8 rounded-xl bg-muted backdrop-blur-sm shadow-xl">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No Table Selected
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
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
