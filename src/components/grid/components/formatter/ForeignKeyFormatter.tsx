import { ArrowRight } from "lucide-react";
import type { PropsWithChildren } from "react";
import type { RenderCellProps } from "react-data-grid";

// import { useProjectContext } from "components/layouts/ProjectLayout/ProjectContext";
// import { ButtonTooltip } from "components/ui/ButtonTooltip";
// import { useTableEditorQuery } from "data/table-editor/table-editor-query";
// import { useTablesQuery } from "data/tables/tables-query";
// import { Popover_Shadcn_, PopoverContent_Shadcn_, PopoverTrigger_Shadcn_ } from "ui";
import type { SupaRow } from "../../types";
import { NullValue } from "../common/NullValue";
import { ReferenceRecordPeek } from "./ReferenceRecordPeek";
import { useProjectStore } from "@/lib/store";
import { useTableEditorQuery } from "@/components/editor/data";
import { useTableEditorStore } from "@/lib/store/table-editor";
import { convertByteaToHex } from "@/lib/helpers";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IconButton } from "@/ui/components";
import { useQuery } from "@tanstack/react-query";

interface Props extends PropsWithChildren<RenderCellProps<SupaRow, unknown>> {
  tableId: string;
}

export const ForeignKeyFormatter = (props: Props) => {
  const { project, sdk } = useProjectStore();
  const { schema } = useTableEditorStore();
  const { tableId, row, column } = props;

  const { data } = useTableEditorQuery({
    sdk,
    id: tableId,
    schema: schema,
  });
  const foreignKeyColumn = data?.columns.find((x) => x.name === column.key);
  const selectedTable = data;

  const relationship = foreignKeyColumn?.references;

  const { data: targetTable } = useQuery({
    queryKey: ["tables", project.$id, schema],
    queryFn: async () => {
      if (!relationship) return undefined;
      const res = await sdk.schema.getTable(relationship?.table, relationship?.schema);
      return res;
    },
  });

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
              type="default"
              className="w-6 h-6"
              icon={<ArrowRight />}
              onClick={(e) => e.stopPropagation()}
              tooltip={"View referencing record"}
            />
          </PopoverTrigger>
          <PopoverContent align="end" className="p-0 w-96">
            {/* portal */}
            <ReferenceRecordPeek
              table={targetTable}
              column={relationship.column}
              value={formattedValue}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
