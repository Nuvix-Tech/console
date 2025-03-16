"use client";

import { useSearchParams } from "next/navigation";

type QueryParams = {
  limit?: number;
};

export const useQuery = ({ limit: _limit }: QueryParams = {}) => {
  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : (_limit ?? 12);
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search");

  const hasQuery = !!searchParams.get("limit") || !!searchParams.get("page") || !!search;

  return { limit, page, hasQuery, search };
};

export { useQuery as useSearchQuery };
