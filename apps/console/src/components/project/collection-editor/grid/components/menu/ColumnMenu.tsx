import { ChevronDown, Edit, Lock, Trash, Unlock } from "lucide-react";
import type { CalculatedColumn } from "react-data-grid";

import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import { Separator } from "@nuvix/sui/components/separator";
import { IconButton } from "@nuvix/ui/components";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";

interface ColumnMenuProps {
  column: CalculatedColumn<any, unknown>;
  isEncrypted?: boolean;
}

const ColumnMenu = ({ column, isEncrypted }: ColumnMenuProps) => {
  const tableEditorSnap = useCollectionEditorStore();

  const snap = useCollectionEditorCollectionStateSnapshot();

  const columnKey = column.key;

  function onFreezeColumn() {
    snap.freezeColumn(columnKey);
  }

  function onUnfreezeColumn() {
    snap.unfreezeColumn(columnKey);
  }

  function onEditColumn() {
    const pgColumn = snap.collection.attributes.find((c) => c.key === column.name);
    if (pgColumn) {
      tableEditorSnap.onEditColumn(pgColumn);
    }
  }

  function onDeleteColumn() {
    const pgColumn = snap.collection.attributes.find((c) => c.key === column.name);
    if (pgColumn) {
      tableEditorSnap.onDeleteColumn(pgColumn);
    }
  }

  function renderMenu() {
    return (
      <>
        {snap.editable && (
          <Tooltip>
            <TooltipTrigger asChild className={`${isEncrypted ? "opacity-50" : ""}`}>
              <DropdownMenuItem className="space-x-2" onClick={onEditColumn} disabled={isEncrypted}>
                <Edit size={14} />
                <p>Edit column</p>
              </DropdownMenuItem>
            </TooltipTrigger>
            {isEncrypted && (
              <TooltipContent side="bottom">Encrypted columns cannot be edited</TooltipContent>
            )}
          </Tooltip>
        )}
        <DropdownMenuItem
          className="space-x-2"
          onClick={column.frozen ? onUnfreezeColumn : onFreezeColumn}
        >
          {column.frozen ? (
            <>
              <Unlock size={14} />
              <p>Unfreeze column</p>
            </>
          ) : (
            <>
              <Lock size={14} />
              <p>Freeze column</p>
            </>
          )}
        </DropdownMenuItem>
        {snap.editable && (
          <>
            <Separator className="my-0.5" />
            <DropdownMenuItem className="space-x-2" onClick={onDeleteColumn}>
              <Trash size={14} stroke="red" />
              <p>Delete column</p>
            </DropdownMenuItem>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            className="opacity-50 flex"
            type="text"
            size="s"
            variant="tertiary"
            style={{ padding: "3px" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            icon={<ChevronDown size={16} strokeWidth={1} />}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom">
          {renderMenu()}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ColumnMenu;
