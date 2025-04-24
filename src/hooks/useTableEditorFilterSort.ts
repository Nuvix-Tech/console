import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useTableEditorFiltersSort = () => {
  const router = useRouter();

  const urlParams = useSearchParams();

  const filters = useMemo(() => {
    return urlParams.getAll("filter");
  }, [urlParams]);

  const sorts = useMemo(() => {
    return urlParams.getAll("sort");
  }, [urlParams]);

  type SetParamsArgs = {
    filter?: string[];
    sort?: string[];
  };

  const setParams = (fn: (prevParams: SetParamsArgs) => SetParamsArgs) => {
    const prevParams = { filter: filters, sort: sorts };
    const newParams = fn(prevParams);

    const hasFilter = newParams.filter !== undefined;
    const hasSort = newParams.sort !== undefined;

    const query = new URLSearchParams(window.location.search);
    if (hasFilter) {
      query.delete("filter");
      newParams.filter?.forEach((filter) => {
        query.append("filter", filter);
      });
    }

    if (hasSort) {
      query.delete("sort");
      newParams.sort?.forEach((sort) => {
        query.append("sort", sort);
      });
    }

    router.push(`?${query.toString()}`, { scroll: false });
  };

  return {
    filters,
    sorts,
    setParams,
  };
};
