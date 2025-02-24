"use client";
import React from "react";
import { flexRender } from "@tanstack/react-table";
import { Table, Progress } from "@chakra-ui/react";
import { SmartLink } from "@/ui/components";
import { ProgressBar } from "@/components/ui/progress";
import { useDataGrid } from "./provider";
import { Checkbox } from "@/components/ui/checkbox";

const TheTable = <T,>() => {
  const { table, loading, showCheckbox } = useDataGrid<T>();

  return (
    <Table.ScrollArea borderWidth="1px" borderRadius={"lg"} width="full">
      <Table.Root
        as={"div"}
        size="md"
        variant="outline"
        borderRadius={"lg"}
        interactive
        // showColumnBorder
      >
        <Table.Header position={"relative"} as={"div"}>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row
              key={headerGroup.id}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width="full"
              as={"div"}
              borderBottom={0.5}
              borderStyle={"solid"}
              borderColor={"border"}
            >
              {showCheckbox ? (
                <Checkbox
                  left="4"
                  aria-label="Select all rows"
                  checked={
                    table.getIsSomeRowsSelected() ? "indeterminate" : table.getIsAllRowsSelected()
                  }
                  onCheckedChange={({ checked }) =>
                    table.toggleAllRowsSelected(checked === "indeterminate" ? undefined : checked)
                  }
                />
              ) : null}
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeader
                  display={"flex"}
                  alignItems={"center"}
                  textTransform={"uppercase"}
                  textOverflow={"ellipsis"}
                  overflow={"hidden"}
                  className="neutral-on-background-medium"
                  fontSize={"sm"}
                  as={"div"}
                  paddingX="4"
                  whiteSpace={"nowrap"}
                  width={header.column.columnDef.size ?? "full"}
                  minWidth={header.column.columnDef.minSize}
                  maxWidth={header.column.columnDef.maxSize}
                  key={header.id}
                  borderBottom={0}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          ))}
          {loading ? (
            <Progress.Root
              size={"xs"}
              value={null}
              position={"absolute"}
              width={"full"}
              height={"0.5"}
              bottom={"0"}
            >
              <ProgressBar height={"0.5"} />
            </Progress.Root>
          ) : null}
        </Table.Header>
        <Table.Body as={"div"}>
          {table.getRowModel().rows.map((row) => (
            <Table.Row
              display={"flex"}
              justifyContent={"space-between"}
              key={row.id}
              borderRadius={0}
              gap={0}
              _hover={{
                bg: "bg.muted",
                cursor: "pointer",
              }}
              asChild
            >
              <SmartLink
                fillWidth
                className="neutral-on-background-medium"
                href={
                  row.getVisibleCells()[0].column.columnDef.meta?.href
                    ? row.getVisibleCells()[0].column.columnDef.meta?.href!(row.original)
                    : undefined
                }
                key={row.id}
                unstyled
                unselectable="on"
              >
                {showCheckbox ? (
                  <Checkbox
                    left="4"
                    aria-label="Select row"
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onClick={(e) => {
                      e.preventDefault();
                      row.getToggleSelectedHandler()(e);
                    }}
                  />
                ) : null}
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell
                    key={cell.id}
                    textOverflow={"ellipsis"}
                    alignContent={"center"}
                    overflow={"hidden"}
                    whiteSpace={"nowrap"}
                    as={"div"}
                    width={cell.column.columnDef.size ?? "full"}
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
  );
};

export { TheTable };
