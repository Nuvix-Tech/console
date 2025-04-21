"use client";
import { ModelsX } from "@/lib/external-sdk";
import { useProjectStore } from "@/lib/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DataGrid } from "react-data-grid";
import { Editor } from "./components";

export const TableEditor = () => {
  const searchParam = useSearchParams();
  const currentTable = searchParam.get("table");

  if (!currentTable) return "Select A table.";

  return (
    <>
      <Suspense fallback={"Loading ....."}>
        <Editor table={currentTable} />
      </Suspense>
    </>
  );
};
