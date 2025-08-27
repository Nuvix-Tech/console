import { ArrowRight } from "lucide-react";
import type { PropsWithChildren } from "react";
import type { RenderCellProps } from "react-data-grid";

import { useTableEditorQuery } from "@/data/table-editor/table-editor-query";
import { useTablesQuery } from "@/data/tables/tables-query";
import type { NuvixRow } from "../../types";
import { NullValue } from "../common/NullValue";
import { ReferenceRecordPeek } from "./ReferenceRecordPeek";
import { useProjectStore } from "@/lib/store";
import { Popover, PopoverContent, PopoverTrigger } from "@nuvix/sui/components/popover";
import { IconButton } from "@nuvix/ui/components";
import { isTableLike } from "@/data/table-editor/table-editor-types";
import { convertByteaToHex } from "@/components/editor/SidePanelEditor/RowEditor/RowEditor.utils";

interface Props extends PropsWithChildren<RenderCellProps<NuvixRow, unknown>> {
  tableId: string;
}

export const ForeignKeyFormatter = (props: Props) => {
  const { project, sdk } = useProjectStore();

  const { tableId, row, column } = props;

  const { data } = useTableEditorQuery({
    projectRef: project?.$id,
    sdk,
    id: Number(tableId),
  });
  const foreignKeyColumn = data?.columns.find((x) => x.name === column.key);
  const selectedTable = isTableLike(data) ? data : undefined;

  const relationship = (selectedTable?.relationships ?? []).find(
    (r) =>
      r.source_schema === selectedTable?.schema &&
      r.source_table_name === selectedTable?.name &&
      r.source_column_name === column.name,
  );
  const { data: tables } = useTablesQuery({
    projectRef: project?.$id,
    includeColumns: true,
    sdk,
    schema: relationship?.target_table_schema,
  });
  const targetTable = tables?.find(
    (table) =>
      table.schema === relationship?.target_table_schema &&
      table.name === relationship.target_table_name,
  );

  const value = row[column.key];
  const formattedValue =
    foreignKeyColumn?.format === "bytea" && !!value ? convertByteaToHex(value) : value;

  return (
    <div className="nx-grid-foreign-key-formatter flex justify-between">
      <span className="nx-grid-foreign-key-formatter__text">
        {formattedValue === null ? <NullValue /> : formattedValue}
      </span>
      {relationship !== undefined && targetTable !== undefined && formattedValue !== null && (
        <Popover>
          <PopoverTrigger asChild>
            <IconButton
              type="button"
              size="s"
              variant="secondary"
              icon={<ArrowRight size={14} />}
              onClick={(e: any) => e.stopPropagation()}
              tooltip={"View referencing record"}
            />
          </PopoverTrigger>
          <PopoverContent align="end" className="p-0 w-96">
            {/* portal */}
            <ReferenceRecordPeek
              table={targetTable}
              column={relationship.target_column_name}
              value={formattedValue}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
