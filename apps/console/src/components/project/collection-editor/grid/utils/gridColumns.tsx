import { CalculatedColumn } from "react-data-grid";

import { COLUMN_MIN_WIDTH } from "../constants";
import { BooleanEditor } from "../components/editor/BooleanEditor";
import { DateTimeEditor } from "../components/editor/DateTimeEditor";
import { JsonEditor } from "../components/editor/JsonEditor";
import { NumberEditor } from "../components/editor/NumberEditor";
import { SelectEditor } from "../components/editor/SelectEditor";
import { TextEditor } from "../components/editor/TextEditor";
import { BooleanFormatter } from "../components/formatter/BooleanFormatter";
import { DefaultFormatter } from "../components/formatter/DefaultFormatter";
import { AddColumn } from "../components/grid/AddColumn";
import { ColumnHeader } from "../components/grid/ColumnHeader";
import { SelectColumn } from "../components/grid/SelectColumn";
import type { ColumnType } from "../types";
import type { Models } from "@nuvix/console";
import {
  AttributeFormat,
  Attributes,
  AttributeTypes,
} from "@/components/project/schema/single/collection/document/components/_utils";

export const ESTIMATED_CHARACTER_PIXEL_WIDTH = 9;

const internalAttributes = [];

export function getGridColumns(
  collection: Models.Collection,
  options?: {
    collectionId?: string;
    editable?: boolean;
    defaultWidth?: string | number;
    onAddColumn?: () => void;
    onExpandJSONEditor: (column: string, row: Models.Document) => void;
    onExpandTextEditor: (column: string, row: Models.Document) => void;
  },
): any[] {
  const columns = collection.attributes.map((x, idx) => {
    const columnType = getColumnType(x);
    const columnDefaultWidth = getColumnDefaultWidth(x);
    const rawSize = typeof x.size === "number" ? x.size : columnDefaultWidth;
    // clamp size to be strictly below 500
    const columnSize = Math.min(rawSize, columnDefaultWidth);
    const columnWidth = Math.max(columnDefaultWidth, columnSize);

    const columnDefinition: CalculatedColumn<Models.Document> = {
      key: x.key,
      name: x.key,
      idx: idx + 1,
      resizable: true,
      sortable: true,
      width: columnWidth,
      minWidth: COLUMN_MIN_WIDTH,
      frozen: false,
      // isLastFrozenColumn: false,
      renderHeaderCell: (props) => (
        <ColumnHeader
          {...props}
          columnType={columnType}
          isPrimaryKey={false}
          isEncrypted={false}
          isArray={x.array}
        />
      ),
      renderEditCell: options
        ? getCellEditor(
            x,
            columnType,
            options?.editable ?? false,
            options.onExpandJSONEditor,
            options.onExpandTextEditor,
          )
        : undefined,
      renderCell: getCellRenderer(x, columnType, {
        collectionId: options?.collectionId,
      }),
      parent: undefined,
      level: 0,
      maxWidth: undefined,
      draggable: false,
    };

    return columnDefinition;
  });

  const gridColumns = [SelectColumn, ...columns];
  if (options?.onAddColumn) {
    gridColumns.push(AddColumn);
  }

  return gridColumns;
}

function getCellEditor(
  columnDefinition: AttributeTypes,
  columnType: ColumnType,
  isEditable: boolean,
  onExpandJSONEditor: (column: string, row: any) => void,
  onExpandTextEditor: (column: string, row: any) => void,
) {
  if (!isEditable) {
    if (columnDefinition.array) {
      // eslint-disable-next-line react/display-name
      return (p: any) => (
        <JsonEditor {...p} isEditable={isEditable} onExpandEditor={onExpandJSONEditor} />
      );
    } else if (
      !([Attributes.Integer, Attributes.Float, Attributes.Boolean] as string[]).includes(columnType)
    ) {
      // eslint-disable-next-line react/display-name
      return (p: any) => (
        <TextEditor {...p} isEditable={isEditable} onExpandEditor={onExpandTextEditor} />
      );
    } else {
      return;
    }
  }
  // if (columnDefinition.isPrimaryKey || !columnDefinition.isUpdatable) {
  //   return;
  // }
  if (columnDefinition.array) {
    // eslint-disable-next-line react/display-name
    return (p: any) => <JsonEditor {...p} onExpandEditor={onExpandJSONEditor} />;
  }
  switch (columnType) {
    case Attributes.Float:
    case Attributes.Integer:
      return NumberEditor;
    case Attributes.Boolean:
      // eslint-disable-next-line react/display-name
      return (p: any) => <BooleanEditor {...p} isNullable={!columnDefinition.required} />;
    case Attributes.Timestamptz:
      return DateTimeEditor(!columnDefinition.required || false);
    case Attributes.Relationship:
    case Attributes.String: // TODO: Implement String and other formats
    case AttributeFormat.Email:
    case AttributeFormat.Url:
    case AttributeFormat.Ip:
      return (p: any) => (
        // eslint-disable-next-line react/display-name
        <TextEditor
          {...p}
          isEditable={isEditable}
          isNullable={!columnDefinition.required}
          onExpandEditor={onExpandTextEditor}
        />
      );
    case AttributeFormat.Enum:
      const options = (columnDefinition as Models.AttributeEnum).elements.map((x) => {
        return { label: x, value: x };
      });
      // eslint-disable-next-line react/display-name
      return (p: any) => (
        <SelectEditor {...p} options={options} isNullable={!columnDefinition.required} />
      );
    default: {
      return undefined;
    }
  }
}

function getCellRenderer(
  columnDef: AttributeTypes,
  columnType: ColumnType,
  metadata: { collectionId?: string },
) {
  switch (columnType) {
    case Attributes.Timestamptz: {
      return BooleanFormatter;
    }
    case Attributes.Relationship: {
      // if (!columnDef.isUpdatable) {
      //   return DefaultFormatter;
      // } else {
      //   // eslint-disable-next-line react/display-name
      //   return (p: any) => <ForeignKeyFormatter {...p} tableId={metadata.tableId} />;
      // }
    }
    default: {
      return DefaultFormatter;
    }
  }
}

function getColumnType(columnDef: AttributeTypes): ColumnType {
  switch (columnDef.type as Attributes) {
    case Attributes.String:
      switch ((columnDef as any).format as AttributeFormat) {
        case AttributeFormat.Enum:
        case AttributeFormat.Email:
        case AttributeFormat.Url:
        case AttributeFormat.Ip:
          return (columnDef as any).format as AttributeFormat;
        default:
          return columnDef.type as Attributes;
      }
    default:
      return columnDef.type as Attributes;
  }
}

export function getColumnDefaultWidth(columnDef: AttributeTypes): number {
  switch (columnDef.type as Attributes) {
    case Attributes.String:
      switch ((columnDef as any).format as AttributeFormat) {
        case AttributeFormat.Enum:
          return 150;
        case AttributeFormat.Email:
          return 230;
        case AttributeFormat.Url:
          return 300;
        case AttributeFormat.Ip:
          return 150;
        default:
          return 250;
      }
    case Attributes.Integer:
      return 120;
    case Attributes.Float:
      return 120;
    case Attributes.Boolean:
      return 120;
    case Attributes.Timestamptz:
      return 180;
    default:
      return 250;
  }
}
