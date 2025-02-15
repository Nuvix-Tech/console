"use client";
import React from "react";
import { useReactTable, getCoreRowModel, flexRender, TableOptions, Updater } from "@tanstack/react-table";
import { Table, VStack, HStack, Flex } from "@chakra-ui/react";
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

const DataGrid = <T,>({ columns, data, ...rest }: TableProps<T>) => {
  const searchParams = useSearchParams();
  const path = usePathname();
  const { push } = useRouter();

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    ...rest
  });


  const onPageSizeChange = (pageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', pageSize.toString())
    push(path + '?' + params.toString())
  }

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page) {
      params.set('page', page.toString())
    } else {
      params.delete('page')
    }
    push(path + '?' + params.toString())
  }

  const pages = createListCollection({
    items: ["6", "12", "24", "48", "96"],
  });

  return (
    <VStack width={'full'}>
      <Table.ScrollArea borderWidth="1px" borderRadius={'lg'} maxW="full">
        <Table.Root size="md" variant="outline" borderRadius={'lg'} interactive showColumnBorder>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row
                key={headerGroup.id}
                display={'flex'}
                alignItems={'center'}
                width='full'
              >
                {headerGroup.headers.map((header) => (
                  <Table.ColumnHeader
                    display={'flex'}
                    alignItems={'center'}
                    // justifyContent={'space-around'}
                    textOverflow={'ellipsis'}
                    overflow={'hidden'}
                    whiteSpace={'nowrap'}
                    width={header.column.columnDef.size ?? 'min-content'}
                    minWidth={header.column.columnDef.minSize}
                    maxWidth={header.column.columnDef.maxSize}
                    key={header.id}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            ))}
          </Table.Header>

          <Table.Body as={'div'}>
            {table.getRowModel().rows.map((row) => (
              <Table.Row
                display={'flex'}
                key={row.id}
                borderRadius={0}
                gap={0}
                _hover={{
                  bg: 'bg.emphasized',
                  cursor: 'pointer',
                }}
                asChild
              >
                <SmartLink
                  fillWidth
                  className="neutral-on-background-strong"
                  href={`users/${row.getValue("$id")}`}
                  key={row.id}
                  unstyled
                  unselectable="on"
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell
                      key={cell.id}
                      textOverflow={'ellipsis'}
                      alignContent={'center'}
                      overflow={'hidden'}
                      whiteSpace={'nowrap'}
                      width={cell.column.columnDef.size ?? 'min-content'}
                      minWidth={cell.column.columnDef.minSize}
                      maxWidth={cell.column.columnDef.maxSize}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  ))}
                </SmartLink>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      <Row marginY="12" fillWidth horizontal="space-between" vertical="center">
        <Row vertical="center" gap="12">
          <SelectRoot
            collection={pages}
            size="sm"
            width="80px"
            value={[table.getState().pagination.pageSize.toString()]}
            onValueChange={(details) => {
              const [value] = details.value;
              onPageSizeChange(parseInt(value));
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
          onPageChange={(details) => onPageChange(details.page)}
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
