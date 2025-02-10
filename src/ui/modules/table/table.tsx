import React from "react";
import { useReactTable, getCoreRowModel, flexRender, TableOptions } from "@tanstack/react-table";
import Link from "next/link";

interface TableProps<T> extends Omit<TableOptions<T>, "getCoreRowModel"> {}

const Table = <T,>({ columns, data }: TableProps<T>) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table" role="table">
      <div className="table-thead" role="rowheader">
        {table.getHeaderGroups().map((headerGroup) => (
          <div className="table-row" role="row" key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className="table-thead-col"
                role="columnheader"
                style={
                  {
                    "--p-col-width": header.column.columnDef.size
                      ? `${header.column.columnDef.size}px`
                      : undefined,
                  } as React.CSSProperties
                }
              >
                <span className="eyebrow-heading-3">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="table-tbody" role="rowgroup">
        {table.getRowModel().rows.map((row) => (
          <Link
            className="table-row"
            role="row"
            href={`users/${row.getValue("$id")}`}
            key={row.id}
            style={{ textDecoration: "none" }}
          >
            {row.getVisibleCells().map((cell) => (
              <div
                key={cell.id}
                className="table-col"
                role="cell"
                data-title={String(cell.column.columnDef.header)}
              >
                {cell.column.id === "imageUrl" ? (
                  <div className="u-inline-flex u-cross-center u-gap-12">
                    <span className="image">
                      <img
                        className="avatar"
                        width="32"
                        height="32"
                        src={String(cell.getValue())}
                        alt=""
                      />
                    </span>
                    <span className="text u-break-word u-line-height-1-5">
                      {String((row.original as any)["name"])}{" "}
                    </span>
                  </div>
                ) : cell.column.id === "options" ? (
                  <div className="u-flex">
                    <button className="button is-text is-only-icon u-hide" aria-label="refresh">
                      <span className="icon-refresh" aria-hidden="true"></span>
                    </button>
                    <button className="button is-text is-only-icon u-hide" aria-label="delete item">
                      <span className="icon-trash" aria-hidden="true"></span>
                    </button>
                    <button className="button is-text is-only-icon" aria-label="more options">
                      <span className="icon-dots-horizontal" aria-hidden="true"></span>
                    </button>
                  </div>
                ) : (
                  <span className="text">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                )}
              </div>
            ))}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Table;
