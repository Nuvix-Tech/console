import React from "react";
import { useReactTable, getCoreRowModel, flexRender, TableOptions } from "@tanstack/react-table";
import { Table, VStack, HStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { createListCollection } from "@chakra-ui/react";
import { Row, SmartLink } from "@/ui/components";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface TableProps<T> extends Omit<TableOptions<T>, "getCoreRowModel"> { }

const DataGrid = <T,>({ columns, data }: TableProps<T>) => {
  const searchParams = useSearchParams();
  const path = usePathname();
  const { push } = useRouter();

  const onPaginationChange = ({ pageIndex, pageSize }: { pageIndex: number, pageSize: number }) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', pageSize.toString())
    if (pageIndex) {
      params.set('page', pageIndex.toString())
    } else {
      params.delete('page')
    }
    push(path + '?' + params.toString())
  }

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange(value) {
      console.log(value)
    }
  });

  const pages = createListCollection({
    items: ["6", "12", "24", "48", "96"],
  });

  return (
    <VStack>
      <Table.Root size="md" variant="outline" borderRadius={'lg'} interactive>
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

      <Row marginY="12" fillWidth horizontal="space-between" vertical="center">
        <Row vertical="center" gap="12">
          <SelectRoot
            collection={pages}
            size="sm"
            width="80px"
            value={[table.getState().pagination.pageSize.toString()]}
            onValueChange={(details) => {
              const [value] = details.value;
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger>
              <SelectValueText placeholder="Select Limit" />
            </SelectTrigger>
            <SelectContent>
              {pages.items.map((page) => (
                <SelectItem item={page} key={page}>
                  {page}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <p className="text"> Total results: {table.getRowCount()}</p>
        </Row>
        <PaginationRoot
          count={table.getRowCount()}
          pageSize={table.getState().pagination.pageSize}
          defaultPage={1}
          variant="subtle"
        >
          <HStack>
            <PaginationPrevTrigger
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            />
            <PaginationItems />
            <PaginationNextTrigger
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            />
          </HStack>
        </PaginationRoot>
      </Row>
    </VStack>
  );
};

export { DataGrid };
