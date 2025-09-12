import { useFilters, useLogsStore } from "@/lib/store/logs";
import { Accordion, Column, Select } from "@nuvix/ui/components";

export const Sidebar = () => {
  const {} = useLogsStore((state) => state);
  const { filters: filter, setFilter } = useFilters();

  return (
    <>
      <Column padding="4" gap="4">
        <Accordion title={<Title>Timeline</Title>} size="s" padding="0" open>
          <Select
            label="Range"
            labelAsPlaceholder
            height="s"
            value={filter.dateRange}
            defaultValue="30m"
            onSelect={(value) => setFilter({ dateRange: value as string })}
            options={[
              { label: "Last 30 minutes", value: "30m" },
              { label: "Last 1 hour", value: "1h" },
              { label: "Last 6 hours", value: "6h" },
              { label: "Last 12 hours", value: "12h" },
              { label: "Last 24 hours", value: "24h" },
              { label: "Last 7 days", value: "7d" },
              { label: "Last 30 days", value: "30d" },
              { label: "All time", value: "all" },
            ]}
          />
        </Accordion>

        <Accordion title={<Title>Status</Title>} size="s" padding="0">
          <Select
            label="Status"
            labelAsPlaceholder
            height="s"
            value={filter.status}
            defaultValue="all"
            onSelect={(value) => setFilter({ status: value as string })}
            options={[
              { label: "All", value: "all" },
              { label: "Success (200-299)", value: "success" },
              { label: "Redirect (300-399)", value: "redirect" },
              { label: "Client Error (400-499)", value: "client_error" },
              { label: "Server Error (500+)", value: "server_error" },
            ]}
          />
        </Accordion>

        <Accordion title={<Title>Method</Title>} size="s" padding="0">
          <Select
            label="Method"
            labelAsPlaceholder
            height="s"
            value={filter.method}
            defaultValue="ALL"
            onSelect={(value) => setFilter({ method: value as string })}
            options={[
              { label: "All", value: "ALL" },
              { label: "GET", value: "GET" },
              { label: "POST", value: "POST" },
              { label: "PUT", value: "PUT" },
              { label: "PATCH", value: "PATCH" },
              { label: "DELETE", value: "DELETE" },
              { label: "HEAD", value: "HEAD" },
              { label: "OPTIONS", value: "OPTIONS" },
            ]}
          />
        </Accordion>

        <Accordion title={<Title>Resource</Title>} size="s" padding="0">
          <Select
            label="Resource"
            labelAsPlaceholder
            height="s"
            value={filter.resource}
            defaultValue="all"
            onSelect={(value) => setFilter({ resource: value as string })}
            options={[
              { label: "All", value: "all" },
              { label: "Auth", value: "auth" },
              { label: "Database", value: "database" },
              { label: "Schemas", value: "schemas" },
              { label: "Storage", value: "storage" },
              { label: "Messaging", value: "messaging" },
            ]}
          />
        </Accordion>

        <Accordion title={<Title>Limit</Title>} size="s" padding="0">
          <Select
            label="Limit"
            labelAsPlaceholder
            height="s"
            value={filter.limit?.toString() || "100"}
            defaultValue="100"
            onSelect={(value) => setFilter({ limit: parseInt(value as string, 10) })}
            options={[
              { label: "50", value: "50" },
              { label: "100", value: "100" },
              { label: "200", value: "200" },
              { label: "500", value: "500" },
              { label: "1000", value: "1000" },
            ]}
          />
        </Accordion>
      </Column>
    </>
  );
};

const Title = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium text-(--text-secondary)">{children}</div>
);
