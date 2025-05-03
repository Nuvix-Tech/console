import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";

// import { useParams } from "common";
import { formatFilterURLParams } from "@/components/grid/SupabaseGrid.utils";
// import { useProjectContext } from "components/layouts/ProjectLayout/ProjectContext";
import { useTableEditorQuery } from "@/data/table-editor/table-editor-query";
import { isTableLike } from "@/data/table-editor/table-editor-types";
import { THRESHOLD_COUNT, useTableRowsCountQuery } from "@/data/table-rows/table-rows-count-query";
// import { useUrlState } from "hooks/ui/useUrlState";
// import { RoleImpersonationState } from "lib/role-impersonation";
// import { useRoleImpersonationStateSnapshot } from "state/role-impersonation-state";
// import { useTableEditorStateSnapshot } from "state/table-editor";

// import { Button, Tooltip, TooltipContent, TooltipTrigger } from "ui";
// import { Input } from "ui-patterns/DataInputs/Input";
// import ConfirmationModal from "ui-patterns/Dialogs/ConfirmationModal";
import { DropdownControl } from "../../common/DropdownControl";
import { formatEstimatedCount } from "./Pagination.utils";
import { useParams, useSearchParams } from "next/navigation";
import { useProjectStore } from "@/lib/store";
import { useTableEditorStore } from "@/lib/store/table-editor";
import { useTableEditorTableStateSnapshot } from "@/lib/store/table";
import { useQuery } from "@tanstack/react-query";
import { Button, IconButton } from "@nuvix/ui/components";
import { Input } from "@/components/editor/components";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import ConfirmationModal from "@/components/editor/components/_confim_dialog";
import { TableParam } from "@/types";

const rowsPerPageOptions = [
  { value: 100, label: "100 rows" },
  { value: 500, label: "500 rows" },
  { value: 1000, label: "1000 rows" },
];

const Pagination = () => {
  const params = useSearchParams();
  const { tableId } = useParams<TableParam>();
  const { project, sdk } = useProjectStore();
  const tableEditorSnap = useTableEditorStore();

  const snap = useTableEditorTableStateSnapshot();

  const { data: selectedTable } = useTableEditorQuery({
    sdk,
    id: Number(tableId),
    projectRef: project?.$id,
  });

  // rowsCountEstimate is only applicable to table entities
  const rowsCountEstimate = null;

  const filter = params.getAll("filter");
  const filters = formatFilterURLParams(filter as string[]);
  const page = snap.page;

  // const roleImpersonationState = useRoleImpersonationStateSnapshot();
  const [isConfirmNextModalOpen, setIsConfirmNextModalOpen] = useState(false);
  const [isConfirmPreviousModalOpen, setIsConfirmPreviousModalOpen] = useState(false);
  const [isConfirmFetchExactCountModalOpen, setIsConfirmFetchExactCountModalOpen] = useState(false);

  const [value, setValue] = useState<string>(page.toString());

  // keep input value in-sync with actual page
  useEffect(() => {
    setValue(String(page));
  }, [page]);

  const { data, isLoading, isSuccess, isError, isFetching } = useTableRowsCountQuery(
    {
      sdk,
      tableId: Number(tableId),
      projectRef: project?.$id,
      filters,
      enforceExactCount: rowsCountEstimate !== null && rowsCountEstimate <= THRESHOLD_COUNT,
    },
    {
      enabled: !!tableId && isTableLike(selectedTable),
    },
  );

  const count = data?.is_estimate ? formatEstimatedCount(data.count) : data?.count.toLocaleString();
  const maxPages = Math.ceil((data?.count ?? 0) / tableEditorSnap.rowsPerPage);
  const totalPages = (data?.count ?? 0) > 0 ? maxPages : 1;

  const onPreviousPage = () => {
    if (page > 1) {
      if (snap.selectedRows.size >= 1) {
        setIsConfirmPreviousModalOpen(true);
      } else {
        goToPreviousPage();
      }
    }
  };

  const onConfirmPreviousPage = () => {
    goToPreviousPage();
  };

  const onNextPage = () => {
    if (page < maxPages) {
      if (snap.selectedRows.size >= 1) {
        setIsConfirmNextModalOpen(true);
      } else {
        goToNextPage();
      }
    }
  };

  const onConfirmNextPage = () => {
    goToNextPage();
  };

  const goToPreviousPage = () => {
    const previousPage = page - 1;
    snap.setPage(previousPage);
  };

  const goToNextPage = () => {
    const nextPage = page + 1;
    snap.setPage(nextPage);
  };

  const onPageChange = (page: number) => {
    const pageNum = page > maxPages ? maxPages : page;
    snap.setPage(pageNum || 1);
  };

  const onRowsPerPageChange = (value: string | number) => {
    const rowsPerPage = Number(value);
    tableEditorSnap.setRowsPerPage(isNaN(rowsPerPage) ? 100 : rowsPerPage);
  };

  useEffect(() => {
    if (page && page > totalPages) {
      snap.setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (tableId !== undefined) {
      snap.setEnforceExactCount(rowsCountEstimate !== null && rowsCountEstimate <= THRESHOLD_COUNT);
    }
  }, [tableId]);
  data;

  return (
    <div className="flex items-center gap-x-4">
      {isLoading && <p className="text-sm text-foreground-light">Loading records count...</p>}

      {isSuccess && (
        <>
          <div className="flex items-center gap-x-2">
            <IconButton
              icon={<ArrowLeft size={18} />}
              variant="ghost"
              disabled={page <= 1 || isLoading}
              onClick={onPreviousPage}
            />
            <p className="text-xs neutral-on-background-medium">Page</p>
            <Input
              className="w-12 h-8"
              min={1}
              max={maxPages}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                const parsedValue = Number(value);
                if (
                  e.code === "Enter" &&
                  !Number.isNaN(parsedValue) &&
                  parsedValue >= 1 &&
                  parsedValue <= maxPages
                ) {
                  onPageChange(parsedValue);
                }
              }}
            />

            <p className="text-xs neutral-on-background-medium">of {totalPages.toLocaleString()}</p>

            <IconButton
              icon={<ArrowRight size={18} />}
              type="outline"
              variant="ghost"
              disabled={page >= maxPages || isLoading}
              onClick={onNextPage}
            />

            <DropdownControl
              options={rowsPerPageOptions}
              onSelect={onRowsPerPageChange}
              side="top"
              align="start"
            >
              <Button size="s" variant="secondary" type="outline" style={{ padding: "3px 10px" }}>
                <span>{`${tableEditorSnap.rowsPerPage} rows`}</span>
              </Button>
            </DropdownControl>
          </div>

          <div className="flex items-center gap-x-2">
            <p className="text-xs text-foreground-light">
              {`${count} ${data?.count === 0 || (data?.count ?? 0) > 1 ? `records` : "record"}`}{" "}
              {data?.is_estimate ? "(estimated)" : ""}
            </p>

            {data?.is_estimate && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    size="s"
                    variant="ghost"
                    type="text"
                    icon={isFetching ? "refresh" : "helpCircle"}
                    onClick={() => {
                      // Show warning if either NOT a table entity, or table rows estimate is beyond threshold
                      if (rowsCountEstimate === null || data.count > THRESHOLD_COUNT) {
                        setIsConfirmFetchExactCountModalOpen(true);
                      } else snap.setEnforceExactCount(true);
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="w-72">
                  This is an estimated value as your table has more than{" "}
                  {THRESHOLD_COUNT.toLocaleString()} rows. <br />
                  <span className="text-brand">
                    Click to retrieve the exact count of the table.
                  </span>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </>
      )}

      {isError && (
        <p className="text-sm text-foreground-light">
          Error fetching records count. Please refresh the page.
        </p>
      )}

      <ConfirmationModal
        visible={isConfirmPreviousModalOpen}
        title="Confirm moving to previous page"
        confirmLabel="Confirm"
        onCancel={() => setIsConfirmPreviousModalOpen(false)}
        onConfirm={() => {
          onConfirmPreviousPage();
        }}
      >
        <p className="text-sm text-foreground-light">
          The currently selected lines will be deselected, do you want to proceed?
        </p>
      </ConfirmationModal>

      <ConfirmationModal
        visible={isConfirmNextModalOpen}
        title="Confirm moving to next page"
        confirmLabel="Confirm"
        onCancel={() => setIsConfirmNextModalOpen(false)}
        onConfirm={() => {
          onConfirmNextPage();
        }}
      >
        <p className="text-sm text-foreground-light">
          The currently selected lines will be deselected, do you want to proceed?
        </p>
      </ConfirmationModal>

      <ConfirmationModal
        variant="warning"
        visible={isConfirmFetchExactCountModalOpen}
        title="Confirm to fetch exact count for table"
        confirmLabel="Retrieve exact count"
        onCancel={() => setIsConfirmFetchExactCountModalOpen(false)}
        onConfirm={() => {
          snap.setEnforceExactCount(true);
          setIsConfirmFetchExactCountModalOpen(false);
        }}
      >
        <p className="text-sm text-foreground-light">
          {rowsCountEstimate === null
            ? `If your table has a row count of greater than ${THRESHOLD_COUNT.toLocaleString()} rows,
          retrieving the exact count of the table may cause performance issues on your database.`
            : `Your table has a row count of greater than ${THRESHOLD_COUNT.toLocaleString()} rows, and
          retrieving the exact count of the table may cause performance issues on your database.`}
        </p>
      </ConfirmationModal>
    </div>
  );
};
export default Pagination;
