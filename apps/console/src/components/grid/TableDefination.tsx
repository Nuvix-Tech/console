import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useMemo, useRef } from "react";

import { useTableDefinitionQuery } from "@/data/database/table-definition-query";
import { useViewDefinitionQuery } from "@/data/database/view-definition-query";
import {
  Entity,
  isMaterializedView,
  isTableLike,
  isView,
  isViewLike,
} from "@/data/table-editor/table-editor-types";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/lib/store";
import { formatSql } from "@/lib/formatSql";
import { timeout } from "@/lib/helpers";
import Footer from "./components/footer/Footer";
import { Button } from "@nuvix/ui/components";
import { GenericSkeletonLoader } from "../editor/components/GenericSkeleton";

export interface TableDefinitionProps {
  entity?: Entity;
}

export const TableDefinition = ({ entity }: TableDefinitionProps) => {
  const { id: ref } = useParams();
  const { project, sdk } = useProjectStore((s) => s);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const { resolvedTheme } = useTheme();

  const viewResult = useViewDefinitionQuery(
    {
      id: entity?.id,
      projectRef: project?.$id,
      sdk,
    },
    {
      enabled: isViewLike(entity) && !!project,
    },
  );

  const tableResult = useTableDefinitionQuery(
    {
      id: entity?.id,
      projectRef: project?.$id,
      sdk,
    },
    {
      enabled: isTableLike(entity) && !!project,
    },
  );

  const { data: definition, isLoading } = isViewLike(entity) ? viewResult : tableResult;

  const prepend = isView(entity)
    ? `create view ${entity.schema}.${entity.name} as\n`
    : isMaterializedView(entity)
      ? `create materialized view ${entity.schema}.${entity.name} as\n`
      : "";

  const formattedDefinition = useMemo(
    () => (definition ? formatSql(prepend + definition) : undefined),
    [definition],
  );

  const handleEditorOnMount = async (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // add margin above first line
    editor.changeViewZones((accessor: any) => {
      accessor.addZone({
        afterLineNumber: 0,
        heightInPx: 4,
        domNode: document.createElement("div"),
      });
    });

    // when editor did mount, it will need a delay before focus() works properly
    await timeout(500);
    editor?.focus();
  };

  if (isLoading) {
    return (
      <div className="h-full grid">
        <div className="p-4">
          <GenericSkeletonLoader />
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-grow overflow-y-auto border-y neutral-border-medium relative">
        <Button
          type="default"
          variant="secondary"
          size="s"
          className="!absolute !top-2 !right-5 z-10"
          href={`/project/${ref}/sql/new?content=${encodeURIComponent(formattedDefinition ?? "")}`}
        >
          Open in SQL Editor
        </Button>
        <Editor
          className="monaco-editor"
          theme={resolvedTheme?.includes("dark") ? "vs-dark" : "vs"}
          onMount={handleEditorOnMount}
          defaultLanguage="pgsql"
          value={formattedDefinition}
          path={""}
          options={{
            domReadOnly: true,
            readOnly: true,
            tabSize: 2,
            fontSize: 13,
            minimap: { enabled: false },
            wordWrap: "on",
            fixedOverflowWidgets: true,
          }}
        />
      </div>

      <Footer />
    </>
  );
};
