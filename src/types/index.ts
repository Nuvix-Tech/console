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
