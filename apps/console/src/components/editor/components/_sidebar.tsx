import TableEditorMenu from "@/components/project/table-editor/components/TableEditorMenu";
import { useGetTables } from "@/data/tables/tables-query";
import { useProjectStore } from "@/lib/store";
import { TableParam } from "@/types";
import { Column, Spinner, Text, ToggleButton } from "@nuvix/ui/components";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export const Sidebar = () => {
  return (
    <div className="h-full w-full">
      <div className="w-full pb-3 px-3 border-b border-b-border">
        <Text variant="label-default-xl">Table Editor</Text>
      </div>
      <div className="h-full min-h-[calc(100svh-140px)]">
        <TableEditorMenu />
      </div>
    </div>
  );
};
