import { create } from "zustand";
import { createSelectors } from "../utils";
import { useSearchParams, useRouter } from "next/navigation";

export interface Log {
  [x: string]: any;
  id: number;
  method: string;
  path: string;
  status: number;
  timestamp: string;
  latency_ms: number;
  error: string | null;
  request_body?: any;
  response_body?: any;
  headers?: Record<string, string>;
  ip?: string;
  user_agent?: string;
}

export interface FilterState {
  search: string;
  method: string;
  status: string;
  dateRange: string;
  resource?: string;
  limit: number;
}

export const STATUS_GROUPS = {
  all: "All Status Codes",
  success: "Success (2xx)",
  redirect: "Redirect (3xx)",
  client_error: "Client Error (4xx)",
  server_error: "Server Error (5xx)",
};

export const METHODS = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

export const DATE_RANGES = {
  "1h": "Last Hour",
  "24h": "Last 24 Hours",
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  all: "All Time",
};

export interface LogsState {
  getLogs: () => Log[];
  _logs: Log[]; // For storing unfiltered logs if needed
  setLogs: (logs: Log[]) => void;
  methods: string[];
  statusGroups: Record<string, string>;
  dateRanges: Record<string, string>;
  handleExport: () => void;
  liveUpdate?: boolean;
  setLiveUpdate: (live: boolean) => void;
  isFetching?: boolean;
  setIsFetching?: (fetching: boolean) => void;
  onRefresh?: () => void;
  setOnRefresh?: (callback: () => void) => void;
  activeLog: Log | null;
  setActiveLog: (log: Log | null) => void;
}

export const logsStore = create<LogsState>((set, get) => ({
  getLogs: () => {
    const { _logs } = get();
    return _logs;
  },
  _logs: [],
  setLogs: (logs: Log[]) => set({ _logs: logs }),
  methods: METHODS,
  statusGroups: STATUS_GROUPS,
  dateRanges: DATE_RANGES,
  handleExport: () => {
    const csv = [
      ["Timestamp", "Method", "Path", "Status", "Latency (ms)", "Error"],
      ...get()
        .getLogs()
        .map((log) => [
          log.timestamp,
          log.method,
          log.path,
          log.status.toString(),
          log.latency_ms.toString(),
          log.error || "",
        ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `api-logs-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
  liveUpdate: false,
  setLiveUpdate: (live: boolean) => set({ liveUpdate: live }),
  setIsFetching: (fetching: boolean) => set({ isFetching: fetching }),
  setOnRefresh: (callback: () => void) => set({ onRefresh: callback }),
  activeLog: null,
  setActiveLog: (log: Log | null) => set({ activeLog: log }),
}));

export const useLogsStore = createSelectors(logsStore);

export const genrateFilterQuery = (filter: FilterState): string => {
  const queries: string[] = [];
  let timestamp;
  const now = new Date();

  switch (filter.dateRange) {
    case "30m":
      timestamp = new Date(now.getTime() - 30 * 60000).toISOString();
      break;
    case "1h":
      timestamp = new Date(now.getTime() - 60 * 60000).toISOString();
      break;
    case "6h":
      timestamp = new Date(now.getTime() - 6 * 60 * 60000).toISOString();
      break;
    case "12h":
      timestamp = new Date(now.getTime() - 12 * 60 * 60000).toISOString();
      break;
    case "24h":
      timestamp = new Date(now.getTime() - 24 * 60 * 60000).toISOString();
      break;
    case "7d":
      timestamp = new Date(now.getTime() - 7 * 24 * 60 * 60000).toISOString();
      break;
    case "30d":
      timestamp = new Date(now.getTime() - 30 * 24 * 60 * 60000).toISOString();
      break;
    case "all":
      timestamp = null;
      break;
    default:
      timestamp = new Date(now.getTime() - 30 * 60000).toISOString();
  }

  if (timestamp) {
    queries.push(`timestamp.gte('${timestamp}')`);
  }

  if (filter.search) {
    queries.push(`path.like('*${filter.search}*')`);
  }

  if (filter.method && filter.method !== "ALL") {
    queries.push(`method.eq('${filter.method}')`);
  }

  if (filter.resource && filter.resource !== "all") {
    queries.push(`resource.eq('${filter.resource}')`);
  }

  if (filter.status && filter.status !== "all") {
    if (filter.status === "success") queries.push("status.between(200, 299)");
    else if (filter.status === "redirect") queries.push("status.between(300, 399)");
    else if (filter.status === "client_error") queries.push("status.between(400, 499)");
    else if (filter.status === "server_error") queries.push("status.gte(500)");
  }

  return queries.join(",");
};

const getFilters = (params: URLSearchParams): FilterState => ({
  search: params.get("search") || "",
  method: params.get("method") || "ALL",
  status: params.get("status") || "all",
  dateRange: params.get("dateRange") || "30m",
  resource: params.get("resource") || undefined,
  limit: parseInt(params.get("limit") || "100", 10),
});

export const useFilters = (): {
  filters: FilterState;
  setFilter: (updates: Partial<FilterState>) => void;
  resetFilter: () => void;
  hasActiveFilters: boolean;
} => {
  const params = useSearchParams();
  const { push } = useRouter();
  const filters = getFilters(params);

  const setFilter = (updates: Partial<FilterState>) => {
    const newParams = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value.toString());
      else newParams.delete(key);
    });
    push(`?${newParams.toString()}`);
  };

  const resetFilter = () => {
    push(window.location.pathname);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "limit") return value !== 100;
    return value && value !== "all" && value !== "ALL" && value !== "30m";
  });

  return { filters, setFilter, resetFilter, hasActiveFilters };
};
