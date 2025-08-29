import { Clipboard, Edit } from "lucide-react";
import { useCallback } from "react";
import { Item, ItemParams, Menu } from "react-contexify";

import type { NuvixRow } from "../../types";
import { useTableEditorStore } from "@/lib/store/table-editor";
import { useTableEditorTableStateSnapshot } from "@/lib/store/table";
import { ROW_CONTEXT_MENU_ID } from ".";
import { copyToClipboard, formatClipboardValue } from "../../utils/common";
import { Icon, Text } from "@nuvix/ui/components";

export type RowContextMenuProps = {
  rows: NuvixRow[];
};

const RowContextMenu = ({ rows }: RowContextMenuProps) => {
  const tableEditorSnap = useTableEditorStore();

  const snap = useTableEditorTableStateSnapshot();

  function onDeleteRow(p: ItemParams) {
    const { props } = p;
    const { rowIdx } = props;
    const row = rows[rowIdx];
    if (row) tableEditorSnap.onDeleteRows([row]);
  }

  function onEditRowClick(p: ItemParams) {
    const { props } = p;
    const { rowIdx } = props;
    const row = rows[rowIdx];
    tableEditorSnap.onEditRow(row);
  }

  const onCopyCellContent = useCallback(
    (p: ItemParams) => {
      const { props } = p;

      if (!snap.selectedCellPosition || !props) {
        return;
      }

      const { rowIdx } = props;
      const row = rows[rowIdx];

      const columnKey = snap.gridColumns[snap.selectedCellPosition.idx as number].key;

      const value = row[columnKey];
      const text = formatClipboardValue(value);

      copyToClipboard(text);
    },
    [rows, snap.gridColumns, snap.selectedCellPosition],
  );

  const actions = [
    {
      label: "Copy cell content",
      onClick: onCopyCellContent,
      icon: Clipboard,
    },
    {
      label: "Edit row",
      onClick: onEditRowClick,
      hidden: !snap.editable,
      icon: Edit,
    },
    {
      label: "Delete row",
      onClick: onDeleteRow,
      hidden: !snap.editable,
      icon: "trash",
      onBackground: "danger-weak",
    },
  ];

  return (
    <>
      <Menu
        id={ROW_CONTEXT_MENU_ID}
        animation={false}
        className="bg-popover backdrop-blur-md !rounded-sm"
      >
        {actions.map((a, i) => (
          <Item key={i} onClick={a.onClick} hidden={a.hidden} className="!rounded-full">
            <Icon name={a.icon} size="s" onBackground={a.onBackground as any} />
            <Text marginLeft="8" variant="label-strong-s" onBackground={a.onBackground as any}>
              {a.label}
            </Text>
          </Item>
        ))}
      </Menu>
    </>
  );
};
export default RowContextMenu;
