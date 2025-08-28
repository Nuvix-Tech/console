import { AlignLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { minifyJSON, prettifyJSON, removeJSONTrailingComma, tryParseJson } from "@/lib/helpers";
import ActionBar from "../../ActionBar";
import { SidePanel } from "@/ui/SidePanel";
import { IconButton } from "@nuvix/ui/components";
import { TwoOptionToggle } from "@/components/others/ui";
import { Code } from "@chakra-ui/react";
import JsonCodeEditor from "@/components/editor/SidePanelEditor/RowEditor/JsonEditor/JsonCodeEditor";
import { DrilldownViewer } from "@/components/editor/SidePanelEditor/RowEditor/JsonEditor/DrilldownViewer";

interface JsonEditProps {
  row?: { [key: string]: any; };
  column: string;
  visible: boolean;
  backButtonLabel?: string;
  applyButtonLabel?: string;
  readOnly?: boolean;
  closePanel: () => void;
  onSaveJSON: (value: string | number | null, resolve: () => void) => void;
}

const JsonEdit = ({
  row,
  column,
  visible,
  backButtonLabel,
  applyButtonLabel,
  readOnly = false,
  closePanel,
  onSaveJSON,
}: JsonEditProps) => {
  const [view, setView] = useState<"edit" | "view">("edit");
  const [jsonStr, setJsonStr] = useState("");
  const value = row?.[column as keyof typeof row] as unknown;
  const jsonString = typeof value === "object" ? JSON.stringify(value) : (value as string);

  const validateJSON = async (resolve: () => void) => {
    try {
      const newJsonStr = removeJSONTrailingComma(jsonStr);
      const minifiedJSON = minifyJSON(newJsonStr);
      if (onSaveJSON) onSaveJSON(minifiedJSON, resolve);
    } catch (error: any) {
      resolve();
      toast.error("JSON seems to have an invalid structure.");
    }
  };

  const prettify = () => {
    const res = prettifyJSON(jsonStr);
    setJsonStr(res);
  };

  useEffect(() => {
    if (visible) {
      const temp = prettifyJSON(jsonString);
      setJsonStr(temp);
    }
  }, [visible]);

  const onClose = useCallback(() => {
    closePanel();
  }, []);

  return (
    <SidePanel
      size="large"
      header={
        <div className="flex items-center justify-between">
          {view === "edit" ? (
            <p>
              {readOnly ? "Viewing" : "Editing"} JSON Field: <Code>{column}</Code>
            </p>
          ) : (
            <p>
              Viewing JSON Field: <Code>{column}</Code>
            </p>
          )}
          <div className="flex items-center gap-x-2">
            {view === "edit" && (
              <IconButton
                variant="ghost"
                icon={<AlignLeft size={18} />}
                onClick={() => prettify()}
                tooltip={"Prettify JSON"}
                tooltipPosition="bottom"
              />
            )}
            <TwoOptionToggle
              size="xs"
              options={["view", "edit"]}
              activeOption={view}
              onClickOption={setView}
            />
          </div>
        </div>
      }
      visible={visible}
      onCancel={onClose}
      customFooter={
        <ActionBar
          hideApply={readOnly}
          closePanel={onClose}
          backButtonLabel={backButtonLabel}
          applyButtonLabel={applyButtonLabel}
          applyFunction={readOnly ? undefined : validateJSON}
        />
      }
    >
      <div className="flex flex-auto h-full flex-col gap-y-4 relative">
        {view === "edit" ? (
          <div className="w-full h-full flex-grow">
            <JsonCodeEditor
              key={jsonString}
              readOnly={readOnly}
              onInputChange={(val) => setJsonStr(val ?? "")}
              value={jsonStr.toString()}
            />
          </div>
        ) : (
          <DrilldownViewer jsonData={tryParseJson(jsonStr)} />
        )}
      </div>
    </SidePanel>
  );
};

export default JsonEdit;
