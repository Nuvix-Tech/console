import { IconButton } from "@nuvix/ui/components";
import { Loader, ArrowLeft, ArrowRight } from "lucide-react";

export interface PaginationProps {
  page: number;
  setPage: (setter: (prev: number) => number) => void;
  rowsPerPage: number;
  currentPageRowsCount?: number;
  isLoading?: boolean;
}

const Pagination = ({
  page,
  setPage,
  rowsPerPage,
  currentPageRowsCount = 0,
  isLoading = false,
}: PaginationProps) => {
  const onPreviousPage = () => {
    setPage((prev) => prev - 1);
  };

  const onNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const hasRunOutOfRows = currentPageRowsCount < rowsPerPage;

  return (
    <div className="flex items-center gap-2">
      {isLoading && <Loader size={14} className="animate-spin" />}

      <IconButton
        icon={<ArrowLeft size={14} />}
        variant="secondary"
        disabled={page <= 1 || isLoading}
        onClick={onPreviousPage}
        title="Previous Page"
      />

      <IconButton
        icon={<ArrowRight size={14} />}
        variant="secondary"
        disabled={hasRunOutOfRows || isLoading}
        onClick={onNextPage}
        title="Next Page"
      />
    </div>
  );
};

export default Pagination;
