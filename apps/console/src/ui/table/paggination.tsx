import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@nuvix/cui/select";
import { Row } from "@nuvix/ui/components";
import { createListCollection } from "@chakra-ui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { HStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@nuvix/cui/pagination";

export type PaginationProps = {
  /**
   * The total number of items.
   */
  totalItems: number;
  /**
   * The current page number.
   */
  currentPage: number;
  /**
   * The number of items per page.
   */
  itemsPerPage: number;
  /**
   * The function to call when the page changes.
   */
  onPageChange?: (page: number) => void;

  /**
   * The function to call when the page size changes.
   */
  onPageSizeChange?: (pageSize: number) => void;

  name?: string;
};

export const Pagination = (props: PaginationProps) => {
  const { totalItems, currentPage, itemsPerPage, onPageChange, onPageSizeChange } = props;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      if (onPageChange) {
        onPageChange(page);
      } else {
        push(`?${params.toString()}`);
      }
    }
  };

  const handlePageSizeChange = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", value.toString());
    if (onPageSizeChange) {
      onPageSizeChange(value);
    } else {
      push(`?${params.toString()}`);
    }
  };

  const pages = createListCollection({
    items: ["6", "12", "24", "48", "96"],
  });

  return (
    <>
      <Row marginX="12" horizontal="space-between" vertical="center">
        <Row vertical="center" gap="12">
          <SelectRoot
            collection={pages}
            size="sm"
            width="80px"
            value={[itemsPerPage.toString()]}
            onValueChange={(details) => {
              const [value] = details.value;
              handlePageSizeChange(parseInt(value, 10));
            }}
          >
            <SelectTrigger>
              <SelectValueText placeholder="Select Limit" />
            </SelectTrigger>
            <SelectContent>
              {pages.items.map((page) => (
                <SelectItem item={page} key={page}>
                  {page}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <p className="text">Projects per page. Total results: {totalItems}</p>
        </Row>
        <PaginationRoot
          count={totalItems}
          pageSize={itemsPerPage}
          defaultPage={1}
          variant="subtle"
          onPageChange={(details) => handlePageChange(details.page)}
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Row>
    </>
  );
};
