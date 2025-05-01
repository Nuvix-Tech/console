"use client";

import { useRouter, useSearchParams } from "next/navigation";

type QueryParams = {
  limit?: number;
};

export const useQuery = ({ limit: _limit }: QueryParams = {}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setQuery = (params: URLSearchParams) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });
    router.replace(`?${newParams.toString()}`);
  };
  const setQueryParam = (key: string | Record<string, any>, value?: string | number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (typeof key === "object") {
      Object.entries(key).forEach(([k, v]) => {
        if (v === undefined) {
          newParams.delete(k);
        } else {
          newParams.set(k, v.toString());
        }
      });
    } else {
      if (value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    }
    router.replace(`?${newParams.toString()}`);
  };
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : (_limit ?? 12);
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search");

  const hasQuery = !!searchParams.get("limit") || !!searchParams.get("page") || !!search;

  return { limit, page, hasQuery, search, params: searchParams, setQueryParam, setQuery };
};

export { useQuery as useSearchQuery };
