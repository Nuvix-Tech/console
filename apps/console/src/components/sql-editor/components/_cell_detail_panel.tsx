import { useEffect, useState } from "react";
import remarkGfm from "remark-gfm";

import CodeEditor from "@/ui/CodeEditor/CodeEditor";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@nuvix/sui/components/sheet";
import { TwoOptionToggle } from "@/components/others/ui";
import { Markdown } from "@/components/others/markdown";
import { Code } from "@chakra-ui/react";
import { CloseButton } from "@nuvix/ui/components";
import { useProjectStore } from "@/lib/store";

interface CellDetailPanelProps {
  column: string;
  value: any;
  visible: boolean;
  onClose: () => void;
}

export const CellDetailPanel = ({ column, value, visible, onClose }: CellDetailPanelProps) => {
  const [view, setView] = useState<"view" | "md">("view");

  const formattedValue =
    value === null
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value, null, "\t")
        : String(value);
  const showMarkdownToggle = typeof value === "string";

  useEffect(() => {
    if (visible) setView("view");
  }, [visible]);

  return (
    <Sheet open={visible} onOpenChange={() => onClose()}>
      <SheetContent className="flex flex-col gap-0">
        <SheetHeader className="py-2.5">
          <SheetTitle className="flex items-center justify-between pr-7">
            <p className="truncate">
              Viewing cell details on column: <Code className="text-sm">{column}</Code>
            </p>
            {showMarkdownToggle && (
              <TwoOptionToggle
                options={["md", "view"]}
                activeOption={view}
                onClickOption={setView}
                size={"s"}
              />
            )}
          </SheetTitle>
        </SheetHeader>
        {view === "view" ? (
          <div className="relative h-full">
            <CodeEditor
              isReadOnly
              id="sql-editor-expand-cell"
              language="json"
              value={formattedValue}
              placeholder={value === null ? "NULL" : undefined}
              options={{ wordWrap: "off", contextmenu: false }}
            />
          </div>
        ) : (
          <div className="flex-grow py-4 px-4 bg-background overflow-y-auto">
            <Markdown
              remarkPlugins={[remarkGfm]}
              className="!max-w-full markdown-body"
              content={formattedValue}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export const CellDetailBox = ({ column, value, visible, onClose }: CellDetailPanelProps) => {
  const [view, setView] = useState<"view" | "md">("view");
  const { panel } = useProjectStore();

  const formattedValue =
    value === null
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value, null, "\t")
        : String(value);
  const showMarkdownToggle = typeof value === "string";

  useEffect(() => {
    if (panel?.open) setView("view");
  }, [panel]);

  return (
    <div className="flex flex-col size-full">
      <div className="py-2 px-2 sticky ">
        <div className="flex items-center justify-between my-auto">
          <p className="truncate">
            Viewing cell details on column: <Code className="text-sm">{column}</Code>
          </p>
          {showMarkdownToggle && (
            <TwoOptionToggle
              options={["md", "view"]}
              activeOption={view}
              onClickOption={setView}
              size={"xs"}
            />
          )}
          <CloseButton onClick={onClose} />
        </div>
      </div>
      {view === "view" ? (
        <div className="relative h-full">
          <CodeEditor
            isReadOnly
            id="sql-editor-expand-cell"
            language="json"
            value={formattedValue}
            placeholder={value === null ? "NULL" : undefined}
            options={{ wordWrap: "off", contextmenu: false }}
          />
        </div>
      ) : (
        <div className="flex-grow py-4 px-4 bg-background overflow-y-auto">
          <Markdown
            remarkPlugins={[remarkGfm]}
            className="!max-w-full markdown-body"
            content={formattedValue}
          />
        </div>
      )}
    </div>
  );
};
