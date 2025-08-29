import type {
  AttributeFormat,
  Attributes,
} from "@/components/project/collection-editor/SidePanelEditor/ColumnEditor/utils";
import { CalculatedColumn, RenderHeaderCellProps } from "react-data-grid";

export interface SavedState {
  filters?: string[];
  sorts?: string[];
  gridColumns: CalculatedColumn<any, any>[];
}

export interface DragItem {
  index: number;
  key: string;
}

export type ColumnType = Attributes | AttributeFormat;

export interface GridForeignKey {
  targetTableSchema?: string | null;
  targetTableName?: string | null;
  targetColumnName?: string | null;
  deletionAction?: string;
  updateAction?: string;
}

export interface ColumnHeaderProps<R> extends RenderHeaderCellProps<R> {
  columnType: ColumnType;
  isPrimaryKey: boolean | undefined;
  isInternal: boolean | undefined;
  isArray?: boolean | undefined;
  foreignKey?: GridForeignKey;
}
