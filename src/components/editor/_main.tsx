"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { NuvixGrid } from "./grid";

export const TableEditor = () => {
  const searchParam = useSearchParams();
  const currentTable = searchParam.get("table");

  if (!currentTable) return "Select A table.";

  return (
    <>
      <Suspense fallback={"Loading ....."}>
        <NuvixGrid table={currentTable} />
      </Suspense>
    </>
  );
};
