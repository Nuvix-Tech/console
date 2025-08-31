import type { XYCoord } from "dnd-core";
import { ArrowRight, Key, Link, Lock } from "lucide-react";
import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import { FOREIGN_KEY_CASCADE_ACTION } from "@/data/database/database-query-constants";

import type { ColumnHeaderProps, ColumnType, DragItem, GridForeignKey } from "../../types";
import { ColumnMenu } from "../menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { getForeignKeyCascadeAction } from "@/components/editor/SidePanelEditor/ColumnEditor/ColumnEditor.utils";
import { Row, Text } from "@nuvix/ui/components";
import { Code } from "@chakra-ui/react";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { Attributes } from "@/components/project/collection-editor/SidePanelEditor/ColumnEditor/utils";
import { AttributeIcon } from "../../../SidePanelEditor/ColumnEditor/ColumnIcon";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import { RelationshipType } from "@nuvix/console";

export function ColumnHeader<R>({
  column,
  columnType,
  isPrimaryKey,
  isInternal,
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
          {!foreignKey && (
            <Tooltip>
              <TooltipTrigger>
                {isPrimaryKey ? (
                  <div className="nx-grid-column-header__inner__primary-key brand-on-background-weak">
                    <Key size={14} strokeWidth={2} />
                  </div>
                ) : (
                  <AttributeIcon
                    type={columnFormat as any}
                    array={isArray}
                    size="s"
                    className="size-6 p-0 !bg-transparent"
                  />
                )}
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-normal">
                {isPrimaryKey ? "Primary key" : columnFormat}
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
        </div>
        <ColumnMenu column={column} isInternal={isInternal} />
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
            <AttributeIcon type={type as any} size="s" className="size-6 p-0 !bg-transparent" />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <Row horizontal="space-between">
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Relationship {foreignKey?.side === "child" ? " (child)" : ""}
              </Text>
              <Text variant="body-strong-xs" onBackground="neutral-medium">
                {getRelationType(foreignKey?.type!)}
              </Text>
            </Row>
            <div className="flex items-center space-x-1 text-sm my-1">
              <Code size="xs" className="bg-muted px-1 py-0.5 rounded">
                {name}
              </Code>
              <ArrowRight size={14} strokeWidth={1.5} className="text-primary" />
              <Code size="xs" className="bg-muted px-1 py-0.5 rounded">
                {foreignKey?.relatedCollection}
                {foreignKey?.twoWay ? `.${foreignKey.twoWayKey}` : ""}
              </Code>
            </div>
            {foreignKey?.onDelete && (
              <Text variant="label-default-xs" onBackground="neutral-medium">
                On delete: {getForeignKeyCascadeAction(foreignKey.onDelete)}
              </Text>
            )}
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

function getRelationType(type: string) {
  switch (type) {
    case RelationshipType.OneToOne:
      return "1:1";
    case RelationshipType.OneToMany:
      return "1:N";
    case RelationshipType.ManyToOne:
      return "N:1";
    case RelationshipType.ManyToMany:
      return "N:N";
    default:
      return type;
  }
}
