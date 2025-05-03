import { UseQueryOptions } from "@tanstack/react-query";

export interface Params<T> {
  params: Promise<T>;
}

export interface SearchParams<T> {
  searchParams: Promise<T>;
}

export type PropsWithParams<T, P = unknown> = P & Params<T>;
export type PropsWithSearchParams<T = Record<string, string | string[]>, P = unknown> = P &
  SearchParams<T>;
export type PropsWithPS<T, S, P = unknown> = PropsWithParams<T, P> & PropsWithSearchParams<S, P>;

export class ResponseError extends Error {
  code?: number;
  requestId?: string;

  constructor(message: string | undefined, code?: number, requestId?: string) {
    super(message || "API error happened while trying to communicate with the server.");
    this.code = code;
    this.requestId = requestId;
  }
}

export type QueryOptions<TFnData = unknown, TData = unknown, TError = unknown> = Omit<
  UseQueryOptions<TFnData, TData, TError>,
  "queryKey" | "queryFn"
>;

export type TableParam = {
  tableId: string;
};
