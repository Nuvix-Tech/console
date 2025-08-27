import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@nuvix/ui/components";
import { Input } from "@/components/editor/components";
import ConfirmationModal from "@/components/editor/components/_confim_dialog";
import { IconButton } from "@chakra-ui/react";
import { DropdownControl } from "@/components/grid/components/common/DropdownControl";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";

const rowsPerPageOptions = [
  { value: 100, label: "100 rows" },
  { value: 500, label: "500 rows" },
  { value: 1000, label: "1000 rows" },
];

const Pagination = () => {
  const tableEditorSnap = useCollectionEditorStore();

  const snap = useCollectionEditorCollectionStateSnapshot();
  const page = snap.page;

  const [isConfirmNextModalOpen, setIsConfirmNextModalOpen] = useState(false);
  const [isConfirmPreviousModalOpen, setIsConfirmPreviousModalOpen] = useState(false);

  const [value, setValue] = useState<string>(page.toString());

  // keep input value in-sync with actual page
  useEffect(() => {
    setValue(String(page));
  }, [page]);

  const count = snap.countDocuments;
  const maxPages = Math.ceil((count ?? 0) / tableEditorSnap.rowsPerPage);
  const totalPages = (count ?? 0) > 0 ? maxPages : 1;

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

  return (
    <div className="flex items-center gap-x-4">
      <div className="flex items-center gap-x-2">
        <IconButton variant="outline" size="xs" disabled={page <= 1} onClick={onPreviousPage}>
          <ArrowLeft />
        </IconButton>
        <p className="text-xs neutral-on-background-medium">Page</p>
        <Input
          min={1}
          size={"xs"}
          width={"12"}
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

        <IconButton variant="outline" size={"xs"} disabled={page >= maxPages} onClick={onNextPage}>
          <ArrowRight />
        </IconButton>

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
          {`${count} ${count === 0 || (count ?? 0) > 1 ? `records` : "record"}`}{" "}
        </p>
      </div>

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
    </div>
  );
};
export default Pagination;
