"use client";
import React from "react";
import { flexRender } from "@tanstack/react-table";
import { Table, Progress } from "@chakra-ui/react";
import { ProgressBar } from "@/components/cui/progress";
import { useDataGrid } from "./provider";
import { Checkbox } from "@/components/cui/checkbox";
import { SHOW_TABLE_BORDER } from "@/lib/constants";
import { useRouter } from "@bprogress/next";

const TheTable = <T,>() => {
  const { table, loading, showCheckbox, stickyCheckBox } = useDataGrid<T>();
  const { push } = useRouter();
  const checkBoxWidth = 12;

  return (
    <Table.ScrollArea borderWidth="1px" borderRadius={"lg"} width="full">
      <Table.Root
        size="md"
        variant="outline"
        borderRadius={"lg"}
        // tableLayout='fixed'
        interactive
        overflow="auto"
        showColumnBorder={SHOW_TABLE_BORDER}
      >
        <Table.Header position="relative">
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row
              key={headerGroup.id}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              position={"relative"}
              width="full"
              borderBottom={0.5}
              borderStyle={"solid"}
              borderColor={"border"}
            >
              {showCheckbox ? (
                <Table.ColumnHeader
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width={checkBoxWidth}
                  minWidth={checkBoxWidth}
                  maxWidth={checkBoxWidth}
                  position={stickyCheckBox ? "sticky" : "relative"}
                  left={stickyCheckBox ? "0" : "auto"}
                  bg={stickyCheckBox ? "bg.muted" : "inherit"}
                  borderBottom={0}
                  zIndex={3}
                >
                  <Checkbox
                    aria-label="Select all rows"
                    checked={
                      table.getIsSomeRowsSelected() ? "indeterminate" : table.getIsAllRowsSelected()
                    }
                    onCheckedChange={({ checked }) =>
                      table.toggleAllRowsSelected(checked === "indeterminate" ? undefined : checked)
                    }
                  />
                </Table.ColumnHeader>
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
                  paddingX="2"
                  whiteSpace={"nowrap"}
                  width={header.column.columnDef.size ?? "auto"}
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
            <Progress.Root size={"xs"} value={null} position={"absolute"} width={"full"}>
              <ProgressBar height={0.5} />
            </Progress.Root>
          ) : null}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.map((row) => {
            const caller = row.getAllCells()?.[0].column.columnDef.meta?.href;
            return (
              <Table.Row
                display={"flex"}
                justifyContent={"space-between"}
                position="relative"
                key={row.id}
                borderRadius={0}
                gap={0}
                _hover={{
                  bg: "bg.muted",
                  cursor: "pointer",
                }}
                _focus={{
                  bg: "bg.subtle",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (!target.closest("[data-action]")) {
                    caller && push(caller(row.original));
                  }
                }}
                // onKeyDown={(e) => {
                //   if ((e.key === "Enter" || e.key === " ") && caller) {
                //     push(caller(row.original))
                //   }
                // }}
                tabIndex={caller ? 0 : -1}
                role={caller && "button"}
                cursor={caller && "pointer"}
              >
                {showCheckbox ? (
                  <Table.Cell
                    alignContent="center"
                    overflow="hidden"
                    justifyContent="center"
                    width={checkBoxWidth}
                    minWidth={checkBoxWidth}
                    maxWidth={checkBoxWidth}
                    position={stickyCheckBox ? "sticky" : "relative"}
                    left={stickyCheckBox ? "0" : "auto"}
                    bg={stickyCheckBox ? "bg.subtle" : "inherit"}
                    zIndex={3}
                  >
                    <Checkbox
                      aria-label="Select row"
                      data-action="checkbox"
                      checked={row.getIsSelected()}
                      disabled={!row.getCanSelect()}
                      cursor="checkbox"
                      onCheckedChange={({ checked }) =>
                        row.toggleSelected(checked === "indeterminate" ? undefined : checked)
                      }
                    />
                  </Table.Cell>
                ) : null}
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell
                    key={cell.id}
                    textOverflow={"ellipsis"}
                    alignContent={"center"}
                    overflow={"hidden"}
                    whiteSpace={"nowrap"}
                    width={cell.column.columnDef.size ?? "full"}
                    minWidth={cell.column.columnDef.minSize}
                    maxWidth={cell.column.columnDef.maxSize}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export { TheTable };
