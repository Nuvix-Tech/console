import { Button, SmartImage } from "@nuvix/ui/components";
import { Stack, Text } from "@chakra-ui/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const EmptyResults = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("limit");
    params.delete("page");
    params.delete("search");
    params.delete("q");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Stack
        width="full"
        height="sm"
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap={4}
      >
        <SmartImage src="/images/empty-dark.svg" alt="Empty state" height={15} width={20.5} />
        <Stack gap={2} justifyContent="center" alignItems="center">
          <Text textStyle="xl" fontWeight="bold">
            No results found
          </Text>

          <Text textStyle="sm" color="text.subtle">
            We couldn't find any results matching your query.
          </Text>
        </Stack>
        <Stack direction="row" gap={4}>
          <Button variant="secondary" onClick={clearFilters}>
            Clear filters
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
