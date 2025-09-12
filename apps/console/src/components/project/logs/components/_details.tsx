import { MonacoEditor } from "@/components/grid/components/common/MonacoEditor";
import { useLogsStore, type Log } from "@/lib/store/logs";
import { useState } from "react";
import { Globe, Server, User, AlertCircle, CheckCircle, XCircle, Zap } from "lucide-react";
import { CloseButton } from "@nuvix/ui/components";

export const LogDetails = ({ log }: { log: Log }) => {
  const [view, setView] = useState<"details" | "json">("details");
  const { setActiveLog } = useLogsStore((state) => state);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return "success-on-background-medium success-background-alpha-medium";
    if (status >= 300 && status < 400) return "info-on-background-weak info-background-alpha-weak";
    if (status >= 400 && status < 500)
      return "warning-on-background-medium warning-background-alpha-medium";
    if (status >= 500) return "danger-on-background-medium danger-background-alpha-medium";
    return "neutral-on-background-weak neutral-background-alpha-weak";
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <CheckCircle className="size-3" />;
    if (status >= 400) return <XCircle className="size-3" />;
    return <AlertCircle className="size-3" />;
  };

  const formatLatency = (ms: number) => {
    if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "text-blue-700 bg-blue-100",
      POST: "text-green-700 bg-green-100",
      PUT: "text-orange-700 bg-orange-100",
      DELETE: "text-red-700 bg-red-100",
      PATCH: "text-purple-700 bg-purple-100",
    };
    return colors[method] || "neutral-on-background-medium neutral-background-alpha-medium";
  };

  return (
    <div className="flex flex-col h-full max-w-[450px]">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(log.method)}`}>
            {log.method}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getStatusColor(log.status)}`}
          >
            {getStatusIcon(log.status)}
            {log.status}
          </span>
          <CloseButton onClick={() => setActiveLog(null)} className="ml-auto" />
        </div>
        <h2 className="text-sm font-semibold neutral-on-background-medium break-all">{log.path}</h2>
        <p className="text-xs neutral-on-background-weak mt-1">
          {new Date(log.timestamp).toLocaleString()}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          onClick={() => setView("details")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            view === "details"
              ? "border-(--accent-on-background-medium) text-(--brand-on-background-weak)"
              : "border-transparent neutral-on-background-weak hover:!text-(--neutral-on-background-medium)"
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setView("json")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            view === "json"
              ? "border-(--accent-on-background-medium) text-(--brand-on-background-weak)"
              : "border-transparent neutral-on-background-weak hover:!text-(--neutral-on-background-medium)"
          }`}
        >
          Raw JSON
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto mb-14">
        {view === "details" ? (
          <div className="p-4 space-y-4">
            {/* Request Info */}
            <div className="!space-y-3">
              <h3 className="font-medium neutral-on-background-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Request
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="neutral-on-background-weak">URL:</span>
                  <span className="font-mono text-xs break-all text-right ml-2">{log.url}</span>
                </div>
                <div className="flex justify-between">
                  <span className="neutral-on-background-weak">Client IP:</span>
                  <span className="font-mono text-xs">{log.client_ip}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="neutral-on-background-weak">Region:</span>
                  <span className="text-xs">{log.region}</span>
                </div> */}
              </div>
            </div>

            {/* Performance */}
            <div className="!space-y-3">
              <h3 className="font-medium neutral-on-background-medium flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Performance
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="neutral-on-background-weak">Latency:</span>
                  <span
                    className={`font-medium ${
                      log.latency_ms < 100
                        ? "text-green-600"
                        : log.latency_ms < 500
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {formatLatency(log.latency_ms)}
                  </span>
                </div>
              </div>
            </div>

            {/* User & Auth */}
            {log.metadata?.user && (
              <div className="!space-y-3">
                <h3 className="font-medium neutral-on-background-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  User
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="neutral-on-background-weak">Email:</span>
                    <span className="text-xs">{log.metadata.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="neutral-on-background-weak">Auth:</span>
                    <span className="text-xs">{log.metadata.auth_type || "None"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Query Parameters */}
            {log.metadata?.query && Object.keys(log.metadata.query).length > 0 && (
              <div className="!space-y-3">
                <h3 className="font-medium neutral-on-background-medium">Query Parameters</h3>
                <div className="space-y-1 text-sm">
                  {Object.entries(log.metadata.query).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="neutral-on-background-weak">{key}:</span>
                      <span className="font-mono text-xs text-right ml-2 break-all">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Headers */}
            {log.metadata?.headers && (
              <div className="!space-y-3">
                <h3 className="font-medium neutral-on-background-medium flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  Headers
                </h3>
                <div className="space-y-1 text-sm max-h-48 overflow-y-auto">
                  {Object.entries(log.metadata.headers)
                    .filter(([key]) => !key.toLowerCase().includes("authorization"))
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="neutral-on-background-weak font-mono text-xs">{key}:</span>
                        <span className="font-mono text-xs text-right ml-2 break-all max-w-[200px]">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Error */}
            {log.metadata?.error && (
              <div className="!space-y-3">
                <h3 className="font-medium danger-on-background-weak flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Error
                </h3>
                <div className="danger-background-alpha-weak border danger-border-alpha-weak rounded p-3">
                  <p className="text-sm danger-on-background-medium font-mono">
                    {JSON.stringify(log.metadata?.error?.message || log.metadata?.error)}
                  </p>
                </div>
              </div>
            )}

            {/* Additional Metadata */}
            {log.metadata?.ips && log.metadata.ips.length > 1 && (
              <div className="!space-y-3">
                <h3 className="font-medium neutral-on-background-medium">IP Chain</h3>
                <div className="space-y-1 text-sm">
                  {log.metadata.ips.map((ip: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="neutral-on-background-weak">IP {index + 1}:</span>
                      <span className="font-mono text-xs">{ip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full">
            <MonacoEditor
              language="json"
              value={JSON.stringify(log, null, 2)}
              height="100%"
              onChange={() => {}}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
};
