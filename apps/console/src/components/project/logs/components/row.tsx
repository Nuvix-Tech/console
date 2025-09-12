"use client";

import { Badge } from "@nuvix/sui/components/badge";
import { useState, useCallback } from "react";
import type { Log } from "@/lib/store/logs";
import { TimestampInfo } from "@/components/editor/components/_timestamp_info";

export const LogRow = ({ log }: { log: Log }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = useCallback((field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  return (
    <div className="hover:bg-(--neutral-alpha-weak) transition-colors mb-px rounded">
      <div
        className="flex items-center gap-3 py-1 px-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="text-xs neutral-on-background-weak tabular-nums">
          <TimestampInfo utcTimestamp={log.timestamp} className="uppercase" />
        </div>

        {/* Method Badge */}
        <p className={"font-mono text-xs uppercase font-semibold neutral-on-background-medium"}>
          {log.method}
        </p>

        {/* Status with Icon */}
        <div className="flex items-center gap-1.5">
          <span
            className={`text-sm font-semibold ${
              log.status >= 200 && log.status < 300
                ? "success-on-background-medium"
                : log.status >= 400 && log.status < 500
                  ? "warning-on-background-weak"
                  : log.status >= 500
                    ? "danger-on-background-weak"
                    : "neutral-on-background-medium"
            }`}
          >
            {log.status}
          </span>
        </div>

        {/* Path */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <code className="text-xs neutral-on-background-weak truncate block">{log.path}</code>
          {log.error && (
            <Badge variant="destructive" className="text-xs">
              Error
            </Badge>
          )}
        </div>

        {/* Latency with Performance Indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              log.latency_ms < 100
                ? "text-green-600"
                : log.latency_ms < 500
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {log.latency_ms.toFixed(2)}ms
          </span>
        </div>
      </div>
    </div>
  );
};
