import React from "react";
import { useReactTable, getCoreRowModel, flexRender, TableOptions } from "@tanstack/react-table";
import { Table } from "@chakra-ui/react";
import { SmartLink } from "@/ui/components";

interface TableProps<T> extends Omit<TableOptions<T>, "getCoreRowModel"> { }

const DataGrid = <T,>({ columns, data }: TableProps<T>) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table.Root size="md" variant="outline" borderRadius={'lg'} >
      <Table.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.ColumnHeader key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        ))}
      </Table.Header>

      <Table.Body>
        {table.getRowModel().rows.map((row) => (
          <Table.Row>
            {/* <SmartLink
              fillWidth
              className="neutral-on-background-strong"
              href={`users/${row.getValue("$id")}`}
              key={row.id}
              unstyled
              unselectable="on"
            > */}
            {row.getVisibleCells().map((cell) => (
              <Table.Cell>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
            ))}
            {/* </SmartLink> */}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export { DataGrid };
