import { ChevronDown, Edit, Lock, Trash, Unlock } from "lucide-react";
import type { CalculatedColumn } from "react-data-grid";

import { useTableEditorStore } from "@/lib/store/table-editor";
import { useTableEditorTableStateSnapshot } from "@/lib/store/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import { Separator } from "@nuvix/sui/components/separator";
import { Icon, IconButton, Text } from "@nuvix/ui/components";

interface ColumnMenuProps {
  column: CalculatedColumn<any, unknown>;
  isEncrypted?: boolean;
}

const ColumnMenu = ({ column, isEncrypted }: ColumnMenuProps) => {
  const tableEditorSnap = useTableEditorStore();

  const snap = useTableEditorTableStateSnapshot();

  const columnKey = column.key;

  function onFreezeColumn() {
    snap.freezeColumn(columnKey);
  }

  function onUnfreezeColumn() {
    snap.unfreezeColumn(columnKey);
  }

  function onEditColumn() {
    const pgColumn = snap.originalTable.columns.find((c) => c.name === column.name);
    if (pgColumn) {
      tableEditorSnap.onEditColumn(pgColumn);
    }
  }

  function onDeleteColumn() {
    const pgColumn = snap.originalTable.columns.find((c) => c.name === column.name);
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
                <Icon name={"edit"} size="s" />
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
              <Icon name={Unlock} size="s" />
              <p>Unfreeze column</p>
            </>
          ) : (
            <>
              <Icon name={Lock} size="s" />
              <p>Freeze column</p>
            </>
          )}
        </DropdownMenuItem>
        {snap.editable && (
          <>
            <Separator className="my-0.5" />
            <DropdownMenuItem className="space-x-2" onClick={onDeleteColumn}>
              <Icon name="trash" size="s" onBackground="danger-weak" />
              <Text onBackground="danger-weak">Delete column</Text>
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
            icon={"chevronDown"}
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
