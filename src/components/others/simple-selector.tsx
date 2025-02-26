import { Button, HStack, Input, Text, VStack, Spinner } from "@chakra-ui/react";
import React, { useState, useEffect, useCallback } from "react";

export type SimpleSelectorProps<T> = {
  placeholder?: string;
  search?: string;
  setSearch?: (v: string) => void;
  page?: number;
  setPage?: (v: number) => void;
  limit?: number;
  total?: number;
  onMap: (
    item: T,
    toggleSelection: (value: string) => void,
    selections: string[],
  ) => React.ReactNode;
  loading?: boolean;
  toggleSelection: (value: string) => void;
  data: T[];
  selections: string[];
};

export const SimpleSelector = <T,>({
  placeholder,
  search,
  setSearch,
  page = 1,
  limit = 10,
  total = 0,
  setPage,
  onMap,
  toggleSelection,
  data,
  loading,
  selections,
}: SimpleSelectorProps<T>) => {
  // Calculate pagination limits
  const hasNextPage = page * limit < total;
  const hasPrevPage = page > 1;

  // Handle next/prev page
  const nextPage = () => hasNextPage && setPage?.(page + 1);
  const prevPage = () => hasPrevPage && setPage?.(page - 1);

  // Reset page when search changes
  useEffect(() => setPage?.(1), [search]);

  return (
    <VStack gap={2} alignItems="flex-start" width="full">
      {setSearch && (
        <Input
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder ?? "Search"}
          width="full"
        />
      )}

      {loading ? (
        <HStack justify="center" width="full">
          <Spinner size="md" />
          <Text>Loading...</Text>
        </HStack>
      ) : data.length > 0 ? (
        <VStack alignItems="flex-start">
          {data.map((item) => onMap(item, toggleSelection, selections))}
        </VStack>
      ) : (
        <Text>{search ? "No results found" : "No data available"}</Text>
      )}

      {setPage && (
        <HStack width="full" justify="space-between" mt={2}>
          <Button disabled={!hasPrevPage} onClick={prevPage}>
            Prev
          </Button>
          <Text>
            Page {page} / {Math.ceil(total / limit)}
          </Text>
          <Button disabled={!hasNextPage} onClick={nextPage}>
            Next
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

interface UsePaginatedSelectorProps<T> {
  fetchFunction: (
    search: string | undefined,
    limit: number,
    offset: number,
  ) => Promise<{ data: T[]; total: number }>;
  limit?: number;
}

export function usePaginatedSelector<T>({
  fetchFunction,
  limit = 10,
}: UsePaginatedSelectorProps<T>) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<T[]>([]);
  const [selections, setSelections] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const offset = (page - 1) * limit;
    const { data: result, total } = await fetchFunction(search, limit, offset);
    setData(result);
    setTotal(total);
    setLoading(false);
  }, [fetchFunction, search, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleSelection = (id: string) => {
    setSelections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  return { loading, data, page, setPage, search, setSearch, selections, toggleSelection, total };
}
