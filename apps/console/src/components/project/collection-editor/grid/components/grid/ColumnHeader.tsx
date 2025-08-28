import type { XYCoord } from "dnd-core";
import { ArrowRight, Key, Link, Lock } from "lucide-react";
import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import { FOREIGN_KEY_CASCADE_ACTION } from "@/data/database/database-query-constants";

import type { ColumnHeaderProps, ColumnType, DragItem, GridForeignKey } from "../../types";
import { ColumnMenu } from "../menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { getForeignKeyCascadeAction } from "@/components/editor/SidePanelEditor/ColumnEditor/ColumnEditor.utils";
import { Text } from "@nuvix/ui/components";
import { Code } from "@chakra-ui/react";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { Attributes } from "@/components/project/collection-editor/SidePanelEditor/ColumnEditor/utils";

export function ColumnHeader<R>({
  column,
  columnType,
  isPrimaryKey,
  isEncrypted,
  isArray,
  foreignKey,
}: ColumnHeaderProps<R>) {
  const ref = useRef<HTMLDivElement>(null);
  const columnIdx = column.idx;
  const columnKey = column.key;
  const columnFormat = getColumnFormat(columnType, isArray ?? false);

  const snap = useCollectionEditorCollectionStateSnapshot();
  const hoverValue = column.name as string;

  // keep snap.gridColumns' order in sync with data grid component
  useEffect(() => {
    if (snap.gridColumns[columnIdx].key != columnKey) {
      snap.updateColumnIdx(columnKey, columnIdx);
    }
  }, [columnKey, columnIdx, snap.gridColumns]);

  const [{ isDragging }, drag] = useDrag({
    type: "column-header",
    item: () => {
      return { key: columnKey, index: columnIdx } as DragItem;
    },
    canDrag: () => !column.frozen,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop({
    accept: "column-header",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      if (column.frozen) {
        return;
      }

      const dragIndex = (item as DragItem).index;
      const dragKey = (item as DragItem).key;
      const hoverIndex = columnIdx;
      const hoverKey = columnKey;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get horizontal middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the items width

      // Dragging left
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging right
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      snap.moveColumn(dragKey, hoverKey);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      (item as DragItem).index = hoverIndex;
    },
  });

  const opacity = isDragging ? 0 : 1;
  const cursor = column.frozen ? "nx-grid-column-header--cursor" : "";
  drag(drop(ref));

  return (
    <div ref={ref} data-handler-id={handlerId} style={{ opacity }} className="w-full group/gridcol">
      <div className={`nx-grid-column-header ${cursor} flex w-full items-center justify-between`}>
        <div className="nx-grid-column-header__inner space-x-2 items-center flex justify-center">
          {renderColumnIcon(columnType, { name: column.name as string, foreignKey })}
          {isPrimaryKey && (
            <Tooltip>
              <TooltipTrigger>
                <div className="nx-grid-column-header__inner__primary-key brand-on-background-weak">
                  <Key size={14} strokeWidth={2} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-normal">
                Primary key
              </TooltipContent>
            </Tooltip>
          )}
          <Text
            as="span"
            variant="label-strong-s"
            onBackground="neutral-strong"
            className="nx-grid-column-header__inner__name"
            title={hoverValue}
          >
            {column.name}
          </Text>
          <Text
            as="span"
            variant="body-default-xs"
            onBackground="neutral-weak"
            className="nx-grid-column-header__inner__format"
          >
            {columnFormat}
            {columnFormat === "bytea" ? ` (hex)` : ""}
          </Text>
          {isEncrypted && (
            <Tooltip>
              <TooltipTrigger>
                <Lock size={14} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-normal">
                Encrypted column
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <ColumnMenu column={column} isEncrypted={isEncrypted} />
      </div>
    </div>
  );
}

function renderColumnIcon(
  type: ColumnType,
  columnMeta: { name?: string; foreignKey?: GridForeignKey },
) {
  const { name, foreignKey } = columnMeta;
  switch (type) {
    case Attributes.Relationship:
      // [Unkown] Look into this separately but this should be a hover card instead
      return (
        <Tooltip>
          <TooltipTrigger className="brand-on-background-weak">
            <Link size={14} strokeWidth={2} />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="font-normal">
              <p className="text-xs text-muted-foreground">Foreign key relation:</p>
              <div className="flex items-center space-x-1">
                <Code size={"xs"}>{name}</Code>
                <ArrowRight size={14} strokeWidth={1.5} className="!text-accent" />
                <Code size={"xs"}>
                  {foreignKey?.targetTableSchema}.{foreignKey?.targetTableName}.
                  {foreignKey?.targetColumnName}
                </Code>
              </div>
              {foreignKey?.updateAction !== FOREIGN_KEY_CASCADE_ACTION.NO_ACTION && (
                <p className="text-xs !text-secondary-foreground mt-1">
                  On update: {getForeignKeyCascadeAction(foreignKey?.updateAction)}
                </p>
              )}
              {foreignKey?.deletionAction !== FOREIGN_KEY_CASCADE_ACTION.NO_ACTION && (
                <p className="text-xs !text-secondary-foreground mt-1">
                  On delete: {getForeignKeyCascadeAction(foreignKey?.deletionAction)}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    default:
      return null;
  }
}

function getColumnFormat(type: ColumnType, isArray: boolean) {
  if (isArray) {
    return `${type.replace("_", "")}[]`;
  } else return type;
}
