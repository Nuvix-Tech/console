import React from "react";

interface TableCellProps {
  style?: React.CSSProperties;
  width?: number;
  className?: string;
  showOverflow?: boolean;
  onlyDesktop?: boolean;
  right?: boolean;
  title?: string;
  children?: React.ReactNode;
}

const TableCell: React.FC<TableCellProps> = ({
  style,
  width,
  className,
  showOverflow,
  onlyDesktop,
  right,
  title,
  children,
}) => {
  return (
    <div
      style={{ ...style, "--p-col-width": width?.toString() ?? "" } as React.CSSProperties}
      className={`table-col ${className} ${showOverflow ? "u-overflow-visible" : ""} ${onlyDesktop ? "is-only-desktop" : ""} ${right ? "u-flex u-main-end" : ""}`}
      data-title={title}
      role="cell"
      data-private
    >
      {children}
    </div>
  );
};

export default TableCell;
