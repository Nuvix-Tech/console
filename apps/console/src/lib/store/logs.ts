import { create } from "zustand";
import { createSelectors } from "../utils";

export interface Log {
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
  filter: FilterState;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
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
}

export const logsStore = create<LogsState>((set, get) => ({
  getLogs: () => {
    const { _logs, filter: filters } = get();

    return _logs.filter((log) => {
      // Search filter
      if (filters.search && !log.path.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Method filter
      if (filters.method !== "ALL" && log.method !== filters.method) {
        return false;
      }

      // Status filter
      if (filters.status !== "all") {
        if (filters.status === "success" && (log.status < 200 || log.status >= 300)) return false;
        if (filters.status === "redirect" && (log.status < 300 || log.status >= 400)) return false;
        if (filters.status === "client_error" && (log.status < 400 || log.status >= 500))
          return false;
        if (filters.status === "server_error" && log.status < 500) return false;
      }

      return true;
    });
  },
  _logs: [],
  setLogs: (logs: Log[]) => set({ _logs: logs }),
  filter: {
    search: "",
    method: "ALL",
    status: "all",
    dateRange: "1h",
  },
  setFilter: (filter: Partial<FilterState>) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
  resetFilter: () =>
    set({
      filter: {
        search: "",
        method: "ALL",
        status: "all",
        dateRange: "1h",
      },
    }),
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
}));

export const useLogsStore = createSelectors(logsStore);
