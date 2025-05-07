import { DiamondIcon, ExternalLink, Fingerprint, Hash, Key, Table2 } from "lucide-react";
import Link from "next/link";
import { Handle, NodeProps, Node } from "@xyflow/react";

import { cn } from "@nuvix/sui/lib/utils";
import { IconButton } from "@chakra-ui/react";
import { Text } from "@nuvix/ui/components";

// ReactFlow is scaling everything by the factor of 2
const TABLE_NODE_WIDTH = 320;
const TABLE_NODE_ROW_HEIGHT = 40;

export type TableNodeData = {
  id?: number;
  name: string;
  ref: string;
  isForeign: boolean;
  columns: {
    id: string;
    isPrimary: boolean;
    isNullable: boolean;
    isUnique: boolean;
    isIdentity: boolean;
    name: string;
    format: string;
  }[];
};

const TableNode = ({
  data,
  targetPosition,
  sourcePosition,
  placeholder,
}: NodeProps<Node<TableNodeData>> & { placeholder?: boolean }) => {
  // Important styles is a nasty hack to use Handles (required for edges calculations), but do not show them in the UI.
  // ref: https://github.com/wbkd/react-flow/discussions/2698
  const hiddenNodeConnector = "!h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0";

  const itemHeight = "h-[22px]";

  return (
    <>
      {data.isForeign ? (
        <header className="px-2 py-1 border-[0.5px] border-[var(--neutral-alpha-medium)] rounded-[4px] neutral-background-medium neutral-on-background-strong flex gap-1 items-center">
          <Text
            onBackground="neutral-medium"
            variant="body-strong-xs"
            className="truncate inline max-w-[98%]"
          >
            {data.name}
          </Text>
          {targetPosition && (
            <Handle
              type="target"
              id={data.name}
              position={targetPosition}
              className={cn(hiddenNodeConnector)}
            />
          )}
        </header>
      ) : (
        <div
          className="border-[0.5px] overflow-hidden rounded-[4px] border-[var(--neutral-alpha-medium)]"
          style={{ width: TABLE_NODE_WIDTH / 2 }}
        >
          <header
            className={cn(
              "pl-2 neutral-background-medium neutral-on-background-strong border flex items-center justify-between",
              itemHeight,
            )}
          >
            <Text
              className="flex gap-x-2 items-center truncate"
              onBackground="neutral-medium"
              variant="body-default-xs"
            >
              <Table2 strokeWidth={1} size={12} className="text-muted-foreground" />
              <span className="truncate max-w-[80%]">{data.name}</span>
            </Text>
            {data.id && !placeholder && (
              <IconButton asChild size={"2xs"} variant="plain">
                <Link href={`/project/${data.ref}/editor/${data.id}`}>
                  <ExternalLink className="text-muted-foreground" />
                </Link>
              </IconButton>
            )}
          </header>

          {data.columns.map((column) => (
            <div
              className={cn(
                "text-[8px] leading-5 relative flex flex-row justify-items-start",
                "bg-muted neutral-on-background-medium",
                "border-t border-[var(--neutral-alpha-medium)]",
                "!border-t-[0.5px]",
                "hover:bg-[var(--neutral-background-strong)] transition cursor-default",
                itemHeight,
              )}
              key={column.id}
            >
              <div
                className={cn(
                  "gap-[0.24rem] flex mx-2 align-middle items-center justify-start",
                  column.isPrimary && "basis-1/5",
                )}
              >
                {column.isPrimary && (
                  <Key
                    size={8}
                    strokeWidth={1}
                    className={cn(
                      "nx-grid-column-header__inner__primary-key",
                      "flex-shrink-0",
                      "text-muted-foreground",
                    )}
                  />
                )}
                {column.isNullable && (
                  <DiamondIcon
                    size={8}
                    strokeWidth={1}
                    className="flex-shrink-0 text-muted-foreground"
                  />
                )}
                {!column.isNullable && (
                  <DiamondIcon
                    size={8}
                    strokeWidth={1}
                    fill="currentColor"
                    className="flex-shrink-0 text-muted-foreground"
                  />
                )}
                {column.isUnique && (
                  <Fingerprint
                    size={8}
                    strokeWidth={1}
                    className="flex-shrink-0 text-muted-foreground"
                  />
                )}
                {column.isIdentity && (
                  <Hash size={8} strokeWidth={1} className="flex-shrink-0 text-muted-foreground" />
                )}
              </div>
              <div className="flex w-full justify-between items-center">
                <Text
                  variant="body-default-xs"
                  className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[85px]"
                >
                  {column.name}
                </Text>
                <span className="px-2 inline-flex justify-end font-mono text-muted-foreground text-[0.5rem]">
                  {column.format}
                </span>
              </div>
              {targetPosition && (
                <Handle
                  type="target"
                  id={column.id}
                  position={targetPosition}
                  className={cn(hiddenNodeConnector, "!left-0")}
                />
              )}
              {sourcePosition && (
                <Handle
                  type="source"
                  id={column.id}
                  position={sourcePosition}
                  className={cn(hiddenNodeConnector, "!right-0")}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export { TABLE_NODE_ROW_HEIGHT, TABLE_NODE_WIDTH, TableNode };
