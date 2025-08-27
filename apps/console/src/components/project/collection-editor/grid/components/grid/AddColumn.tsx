import { Plus } from "lucide-react";
import type { CalculatedColumn } from "react-data-grid";

import { useTableEditorStore } from "@/lib/store/table-editor";
import { ADD_COLUMN_KEY } from "../../constants";
import { DefaultFormatter } from "../formatter/DefaultFormatter";
import { Button } from "@nuvix/ui/components";

export const AddColumn: CalculatedColumn<any, any> = {
  key: ADD_COLUMN_KEY,
  name: "",
  idx: 999,
  width: 100,
  maxWidth: 100,
  resizable: false,
  sortable: false,
  frozen: false,
  // isLastFrozenColumn: false,
  renderHeaderCell() {
    return <AddColumnHeader aria-label="Add New Row" />;
  },
  renderCell: DefaultFormatter,

  // [Next 18 Refactor] Double check if this is correct
  parent: undefined,
  level: 0,
  minWidth: 0,
  draggable: false,
};

const AddColumnHeader = () => {
  const tableEditorSnap = useTableEditorStore();

  return (
    <div className="flex h-full w-full py-1.5 items-center">
      <Button
        fillWidth
        variant="tertiary"
        size="s"
        type="text"
        onClick={tableEditorSnap.onAddColumn}
        prefixIcon={<Plus size={16} />}
      />
    </div>
  );
};
