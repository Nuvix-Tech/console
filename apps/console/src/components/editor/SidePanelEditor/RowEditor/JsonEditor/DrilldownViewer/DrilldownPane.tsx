import { Dictionary } from "@nuvix/pg-meta/src/query";
import { isNull, noop } from "lodash";
import { ChevronRight } from "lucide-react";

interface DrilldownPaneProps {
  pane: number;
  jsonData: Dictionary<any>;
  activeKey?: string;
  onSelectKey: (key: string, pane: number) => void;
}

const DrilldownPane = ({ pane, jsonData, activeKey, onSelectKey = noop }: DrilldownPaneProps) => {
  if (!jsonData) {
    return (
      <div className={`flex-1 ${pane === 2 ? "border-l border-default" : ""}`}>
        <div className="flex space-x-2 py-2 px-5">
          <p className="text-sm">Invalid JSON</p>
        </div>
      </div>
    );
  }

  if (Object.keys(jsonData).length === 0) {
    return (
      <div className={`max-w-[50%] flex-1 ${pane === 2 ? "border-l border-default" : ""}`}>
        <div className="flex space-x-2 py-2 px-5">
          <p className="text-sm opacity-50">No data available</p>
        </div>
      </div>
    );
  }

  const keysWithChildren = Object.keys(jsonData).filter(
    (key: string) => typeof jsonData[key] === "object" && !isNull(jsonData[key]),
  );

  const keysWithoutChildren = Object.keys(jsonData).filter(
    (key: string) => isNull(jsonData[key]) || typeof jsonData[key] !== "object",
  );

  return (
    <div className={`max-w-[50%] flex-1 ${pane === 2 ? "border-l border-default" : ""}`}>
      {keysWithChildren.map((key: string) => (
        <div
          key={key}
          className={`
              ${key === activeKey ? "bg-(--neutral-alpha-weak)" : ""}
              group flex cursor-pointer items-center transition
              justify-between py-2 px-5 hover:bg-(--code-blue)/5
            `}
          onClick={() => onSelectKey(key, pane)}
        >
          <p className="font-mono text-xs font-semibold text-(--code-blue)">{key}</p>
          <div
            className={`${
              key === activeKey ? "opacity-100" : "opacity-50"
            } group-hover:opacity-100 transition`}
          >
            <ChevronRight strokeWidth={2} size={16} />
          </div>
        </div>
      ))}
      {keysWithoutChildren.map((key: string) => (
        <div key={key} className="flex space-x-2 py-2 px-5">
          <p className="font-mono text-xs font-semibold text-(--code-blue)">{key}:</p>
          <p
            className={`break-all font-mono text-xs ${
              typeof jsonData[key] !== "string" ? "text-(--code-moss)" : "text-(--code-gray)"
            }`}
          >
            {isNull(jsonData[key])
              ? "null"
              : typeof jsonData[key] === "string"
                ? `"${jsonData[key]}"`
                : jsonData[key].toString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DrilldownPane;
