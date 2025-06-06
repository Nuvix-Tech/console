"use client";
import { HStack, Text, VStack, Spinner, Input } from "@chakra-ui/react";
import { Button } from "@nuvix/sui/components/button";
import React, { useState, useEffect, useCallback } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { SearchIcon } from "lucide-react";

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
    <VStack gap={3} alignItems="flex-start" width="full">
      {setSearch && (
        <div className="border !border-l-0 !border-r-0 border-dashed rounded-none px-4 flex items-center h-10 w-full">
          <SearchIcon className="size-4 opacity-80" />
          <Input
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder ?? "Search"}
            width="full"
            size={"xs"}
            unstyled
            className="border-none outline-none px-2"
          />
        </div>
      )}

      {loading ? (
        <HStack justify="center" width="full">
          <Spinner size="md" />
        </HStack>
      ) : null}

      {data.length > 0 ? (
        <VStack alignItems="flex-start" width="full" px="4" gap={0}>
          {data.map((item) => onMap(item, toggleSelection, selections))}
        </VStack>
      ) : (
        <Text mx="auto" textStyle="sm" color="var(--neutral-on-background-weak)">
          {search ? "No results found" : !loading && "No data available"}
        </Text>
      )}

      {setPage && (
        <HStack
          width="full"
          justify="space-between"
          mt={4}
          borderY={"1px solid"}
          borderStyle={"dashed"}
          borderColor="border.muted"
          height="40px"
        >
          <Button
            type="button"
            disabled={!hasPrevPage}
            onClick={prevPage}
            size="sm"
            variant="ghost"
          >
            <LuChevronLeft />
            Prev
          </Button>
          <p className="text-primary/60">
            Page {page} / {Math.ceil(total / limit)}
          </p>
          <Button
            type="button"
            disabled={!hasNextPage}
            onClick={nextPage}
            size="sm"
            variant="ghost"
          >
            Next
            <LuChevronRight />
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

interface UsePaginatedSelectorProps<T, D> {
  fetchFunction: (
    search: string | undefined,
    limit: number,
    offset: number,
  ) => Promise<{ data: T[]; total: number }>;
  limit?: number;
}

export function usePaginatedSelector<T, D extends { $id: string }>({
  fetchFunction,
  limit = 10,
}: UsePaginatedSelectorProps<T, D>) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<T[]>([]);
  const [selections, setSelections] = useState<string[]>([]);
  const [selected, setSelected] = useState<D[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const { data: result, total } = await fetchFunction(search, limit, offset);
      setData(result);
      setTotal(total);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, page, limit]);

  const toggleSelection = useCallback((id: string) => {
    setSelections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }, []);

  const toggleSelected = useCallback((item: D) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.$id === item.$id);
      return exists ? prev.filter((s) => s.$id !== item.$id) : [...prev, item];
    });
  }, []);

  const clearSelections = useCallback(() => {
    setSelections([]);
    setSelected([]);
  }, []);

  const resetPagination = useCallback(() => {
    setPage(1);
  }, []);

  return {
    loading,
    data,
    page,
    setPage: resetPagination,
    search,
    setSearch,
    selections,
    toggleSelection,
    toggleSelected,
    selected,
    setSelected,
    clearSelections,
    total,
    limit,
    refetch: fetchData,
  };
}
