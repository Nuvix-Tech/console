import { Editor } from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@nuvix/sui/components/resizable";
import { useTheme } from "next-themes";

export const SqlEditor = () => {
  const { resolvedTheme } = useTheme();
  const intellisenseEnabled = true;

  return (
    <>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel maxSize={80}>
          <Editor
            language="pgsql"
            theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
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
        <ResizableHandle withHandle />
        <ResizablePanel maxSize={70}></ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};
