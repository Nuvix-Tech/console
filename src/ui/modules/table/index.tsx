import React from "react";

interface TableColumn {
  header: string;
  accessor: string;
  isDesktopOnly?: boolean;
  width?: number;
}

interface TableRowProps {
  [key: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  rows: TableRowProps[];
}

const TableRow: React.FC<{ row: TableRowProps; columns: TableColumn[] }> = ({ row, columns }) => (
  <a className="table-row" role="row" href="#">
    {columns.map((column, index) => (
      <div
        key={index}
        className={`table-col ${column.isDesktopOnly ? "is-only-desktop" : ""}`}
        role="cell"
        data-title={column.header}
      >
        {column.accessor === "imageUrl" ? (
          <div className="u-inline-flex u-cross-center u-gap-12">
            <span className="image">
              <img className="avatar" width="32" height="32" src={row[column.accessor]} alt="" />
            </span>
            <span className="text u-break-word u-line-height-1-5">{row.name}</span>
          </div>
        ) : column.accessor === "options" ? (
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
          <span className="text">{row[column.accessor]}</span>
        )}
      </div>
    ))}
  </a>
);

const Table: React.FC<TableProps> = ({ columns, rows }) => (
  <div className="table" role="table">
    <div className="table-thead" role="rowheader">
      <div className="table-row" role="row">
        {columns.map((column, index) => (
          <div
            key={index}
            className={`table-thead-col ${column.isDesktopOnly ? "is-only-desktop" : ""}`}
            role="columnheader"
            style={
              {
                "--p-col-width": column.width ? `${column.width}px` : undefined,
              } as React.CSSProperties
            }
          >
            <span className="eyebrow-heading-3">{column.header}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="table-tbody" role="rowgroup">
      {rows.map((row, index) => (
        <TableRow key={index} row={row} columns={columns} />
      ))}
    </div>
  </div>
);

export default Table;
