import { Editor } from "@monaco-editor/react";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import remarkGfm from "remark-gfm";

import ActionBar from "../ActionBar";
import { SidePanel } from "@/ui/SidePanel";
import { TwoOptionToggle } from "@/components/others/ui";
import { Markdown } from "@/components/others/markdown";
import { Code } from "@chakra-ui/react";
import { useTheme } from "next-themes";

interface TextEditorProps {
  visible: boolean;
  readOnly?: boolean;
  row?: { [key: string]: any };
  column: string;
  closePanel: () => void;
  onSaveField: (value: string, resolve: () => void) => void;
}

export const TextEditor = ({
  visible,
  readOnly = false,
  row,
  column,
  closePanel,
  onSaveField,
}: TextEditorProps) => {
  const { resolvedTheme } = useTheme();

  const theme = useCallback(() => {
    if (resolvedTheme === "dark") {
      return "vs-dark";
    } else {
      return "light";
    }
  }, [resolvedTheme]);

  const [strValue, setStrValue] = useState("");
  const [view, setView] = useState<"edit" | "view">("edit");
  const value = row?.[column as keyof typeof row] as unknown as string;

  const saveValue = (resolve: () => void) => {
    if (onSaveField) onSaveField(strValue, resolve);
  };

  useEffect(() => {
    if (visible) {
      setView("edit");
      setStrValue(value);
    }
  }, [visible]);

  const onClose = useCallback(() => {
    closePanel();
  }, []);

  return (
    <SidePanel
      size="large"
      visible={visible}
      onCancel={onClose}
      header={
        <div className="flex items-center justify-between">
          <p>
            {readOnly ? "Viewing" : "Editing"} value of: <Code>{column}</Code>
          </p>
          <TwoOptionToggle
            options={["view", "edit"]}
            size="xs"
            activeOption={view}
            onClickOption={setView}
          />
        </div>
      }
      customFooter={
        <ActionBar
          hideApply={readOnly}
          closePanel={onClose}
          backButtonLabel="Cancel"
          applyButtonLabel="Save value"
          applyFunction={readOnly ? undefined : saveValue}
        />
      }
    >
      <div className="relative flex flex-auto h-full flex-col gap-y-4">
        {view === "edit" ? (
          <div className="w-full h-full flex-grow">
            <Editor
              key={value}
              theme={theme()}
              className="monaco-editor"
              defaultLanguage="markdown"
              value={strValue}
              loading={<Loader className="animate-spin" strokeWidth={2} size={20} />}
              options={{
                readOnly,
                tabSize: 2,
                fontSize: 13,
                minimap: {
                  enabled: false,
                },
                wordWrap: "on",
                fixedOverflowWidgets: true,
                lineNumbersMinChars: 4,
              }}
              onMount={(editor) => {
                editor.changeViewZones((accessor) => {
                  accessor.addZone({
                    afterLineNumber: 0,
                    heightInPx: 4,
                    domNode: document.createElement("div"),
                  });
                });
                editor.focus();
              }}
              onChange={(val) => setStrValue(val ?? "")}
            />
          </div>
        ) : (
          <SidePanel.Content className="py-4 bg-default flex-grow">
            <Markdown
              remarkPlugins={[remarkGfm]}
              className="bg-background markdown-body"
              content={strValue}
            />
          </SidePanel.Content>
        )}
      </div>
    </SidePanel>
  );
};
