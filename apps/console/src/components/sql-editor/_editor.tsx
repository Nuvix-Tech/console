import { Editor } from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@nuvix/sui/components/resizable";
import { useTheme } from "next-themes";
import { BottomPanel } from "./components";
import { useSqlEditorStateSnapshot } from "@/lib/store/sql-runner";
import { useProjectStore } from "@/lib/store";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const SqlEditor = () => {
  const { resolvedTheme } = useTheme();
  const intellisenseEnabled = true;
  const { sql, setSql } = useSqlEditorStateSnapshot();
  const { setSidebarNull } = useProjectStore((s) => s);
  const params = useSearchParams();
  const content = params.get("content");
  useEffect(setSidebarNull, []);

  useEffect(() => {
    if (content) {
      setSql(decodeURIComponent(content));
    }
  }, [content, setSql]);

  return (
    <>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel maxSize={80}>
          <Editor
            language="pgsql"
            theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
            value={sql}
            onChange={(value) => setSql(value)}
            options={{
              tabSize: 2,
              fontSize: 13,
              lineDecorationsWidth: 0,
              minimap: { enabled: false },
              wordWrap: "on",
              padding: { top: 4 },
              suggest: {
                showMethods: intellisenseEnabled,
                showFunctions: intellisenseEnabled,
                showConstructors: intellisenseEnabled,
                showDeprecated: intellisenseEnabled,
                showFields: intellisenseEnabled,
                showVariables: intellisenseEnabled,
                showClasses: intellisenseEnabled,
                showStructs: intellisenseEnabled,
                showInterfaces: intellisenseEnabled,
                showModules: intellisenseEnabled,
                showProperties: intellisenseEnabled,
                showEvents: intellisenseEnabled,
                showOperators: intellisenseEnabled,
                showUnits: intellisenseEnabled,
                showValues: intellisenseEnabled,
                showConstants: intellisenseEnabled,
                showEnums: intellisenseEnabled,
                showEnumMembers: intellisenseEnabled,
                showKeywords: intellisenseEnabled,
                showWords: intellisenseEnabled,
                showColors: intellisenseEnabled,
                showFiles: intellisenseEnabled,
                showReferences: intellisenseEnabled,
                showFolders: intellisenseEnabled,
                showTypeParameters: intellisenseEnabled,
                showIssues: intellisenseEnabled,
                showUsers: intellisenseEnabled,
                showSnippets: intellisenseEnabled,
              },
            }}
          />
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className="opacity-5 hover:opacity-60 transition-opacity hover:bg-accent"
        />
        <ResizablePanel maxSize={70}>
          <BottomPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};
