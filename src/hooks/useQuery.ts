"use client";

import { useSearchParams } from "next/navigation";

type QueryParams = {
  limit?: number;
};

export const useQuery = ({ limit: _limit }: QueryParams = {}) => {
  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : (_limit ?? 12);
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const hasQuery = !!searchParams.get("limit") || !!searchParams.get("page");

  return { limit, page, hasQuery };
};
