import { ArrowRight } from "lucide-react";
import type { PropsWithChildren } from "react";
import type { RenderCellProps } from "react-data-grid";

// import { useProjectContext } from "components/layouts/ProjectLayout/ProjectContext";
// import { ButtonTooltip } from "components/ui/ButtonTooltip";
import { useTableEditorQuery } from "@/data/table-editor/table-editor-query";
import { useTablesQuery } from "@/data/tables/tables-query";
// import { Popover_Shadcn_, PopoverContent_Shadcn_, PopoverTrigger_Shadcn_ } from "ui";
import type { SupaRow } from "../../types";
import { NullValue } from "../common/NullValue";
import { ReferenceRecordPeek } from "./ReferenceRecordPeek";
import { useProjectStore } from "@/lib/store";
import { useTableEditorStore } from "@/lib/store/table-editor";
import { convertByteaToHex } from "@/lib/helpers";
import { Popover, PopoverContent, PopoverTrigger } from "@nuvix/sui/components/popover";
import { IconButton } from "@nuvix/ui/components";
import { useQuery } from "@tanstack/react-query";
import { isTableLike } from "@/data/table-editor/table-editor-types";

interface Props extends PropsWithChildren<RenderCellProps<SupaRow, unknown>> {
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
    <div className="sb-grid-foreign-key-formatter flex justify-between">
      <span className="sb-grid-foreign-key-formatter__text">
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
