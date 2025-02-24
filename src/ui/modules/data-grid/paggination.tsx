import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { HStack } from "@chakra-ui/react";
import { useDataGrid } from "./provider";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export const Paggination = () => {
  const { table, loading } = useDataGrid();
  const searchParams = useSearchParams();
  const path = usePathname();
  const { push } = useRouter();

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    push(path + "?" + params.toString());
  };

  return (
    <>
      <PaginationRoot
        count={table.getRowCount()}
        pageSize={table.getState().pagination.pageSize}
        onPageChange={(details) => onPageChange(details.page)}
        defaultPage={1}
        variant="subtle"
      >
        <HStack>
          <PaginationPrevTrigger
            onClick={() => table.previousPage()}
            disabled={loading || !table.getCanPreviousPage()}
          />
          <PaginationItems />
          <PaginationNextTrigger
            onClick={() => table.nextPage()}
            disabled={loading || !table.getCanNextPage()}
          />
        </HStack>
      </PaginationRoot>
    </>
  );
};
