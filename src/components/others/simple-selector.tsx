import { Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import React from "react";

export type SimpleSelectorProps<T, S> = {
  placeholder?: string;
  search?: string;
  setSearch?: (v: string) => void;
  limit?: number;
  page?: number;
  total?: number;
  setPage?: (p: number) => void;
  onMap: (v: T, i: number, onSelect: S) => React.ReactNode;
  loading?: boolean;
  onSelect: S;
  data: T[];
};

export const SimpleSelector = <T, S>({
  placeholder,
  search,
  setSearch,
  limit,
  page,
  setPage,
  total,
  onMap,
  onSelect,
  data,
  loading,
}: SimpleSelectorProps<T, S>) => {
  return (
    <>
      <VStack gap={2} alignItems={"flex-start"}>
        {setSearch ? (
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder ?? "Search"}
            width={"full"}
          />
        ) : null}

        {data.length > 0 ? (
          data.map((v, i) => onMap(v, i, onSelect))
        ) : search ? (
          <Text>No results found</Text>
        ) : loading ? (
          "Loading ......"
        ) : (
          <Text>No data found</Text>
        )}

        <HStack>
          {total !== undefined ? <Text>{total} Total</Text> : null}

          {setPage ? (
            <HStack gap={2} alignItems={"center"}>
              <Button>Prev</Button>
              <Button>Next</Button>
            </HStack>
          ) : null}
        </HStack>
      </VStack>
    </>
  );
};
