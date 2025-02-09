import React from "react";

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="table-thead" role="rowheader">
      <div className="table-row" role="row">
        {children}
      </div>
    </div>
  );
};

export default TableHeader;
