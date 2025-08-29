import { ChevronDown, Edit, Edit2, Lock, Unlock } from "lucide-react";
import type { CalculatedColumn } from "react-data-grid";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import { Separator } from "@nuvix/sui/components/separator";
import { Icon, IconButton, Text } from "@nuvix/ui/components";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";

interface ColumnMenuProps {
  column: CalculatedColumn<any, unknown>;
  isInternal?: boolean;
}

const ColumnMenu = ({ column, isInternal }: ColumnMenuProps) => {
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
        {!isInternal && snap.editable && (
          <DropdownMenuItem className="space-x-2" onClick={onEditColumn} disabled={isInternal}>
            <Icon name={Edit} size="s" />
            <p>Edit column</p>
          </DropdownMenuItem>
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

        <Separator className="my-0.5" />

        <DropdownMenuItem
          className="space-x-2"
          onClick={() => tableEditorSnap.onAddIndex([column.key])}
        >
          <Icon name={Edit2} size="s" />
          <p>Create Index</p>
        </DropdownMenuItem>

        {!isInternal && (
          <>
            <Separator className="my-0.5" />
            <DropdownMenuItem className="space-x-2" onClick={onDeleteColumn}>
              <Icon name="trash" onBackground="danger-weak" size="s" />
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
