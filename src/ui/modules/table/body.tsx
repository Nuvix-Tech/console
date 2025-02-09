import React from "react";

interface TableBodyProps {
  columns: number;
  children: React.ReactNode;
}

const TableBody: React.FC<TableBodyProps> = ({ columns, children }) => {
  return (
    <div className="table-tbody" role="rowgroup">
      {children}
      {false && (
        // isCloud && limitReached && service &&
        <tr className="table-row">
          <td className="table-col" width="100%" colSpan={columns}>
            <span className="u-flex u-gap-24 u-main-center u-cross-center">
              {/* <slot name="limit" upgradeMethod={upgradeMethod} limit={limit}>
                <span className="text">
                  Upgrade your plan to add {name} to your organization
                </span>
                <Button
                  href={upgradeURL}
                  onClick={() =>
                    trackEvent('click_organization_upgrade', {
                      from: 'button',
                      source: 'table_row_limit_reached',
                    })
                  }
                >
                  Upgrade plan
                </Button>
              </slot> */}
            </span>
          </td>
        </tr>
      )}
    </div>
  );
};

export default TableBody;
