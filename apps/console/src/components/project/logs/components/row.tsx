interface Log {
  id: number;
  request_id: string;
  method: string;
  path: string;
  status: number;
  timestamp: string;
  client_ip: string;
  user_agent: string;
  url: string;
  latency_ms: number;
  region: string;
  error: string | null;
  metadata: {
    ips: string[];
    host: string;
    headers: Record<string, string>;
  };
}

export const LogRow: React.FC<{ log: Log }> = ({ log }) => {
  return (
    <tr className="border-b">
      <td className="px-4 py-2">{log.id}</td>
      <td className="px-4 py-2">{log.method}</td>
      <td className="px-4 py-2">{log.path}</td>
      <td className="px-4 py-2">{log.status}</td>
      <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
      <td className="px-4 py-2">{log.client_ip}</td>
      <td className="px-4 py-2">{log.latency_ms} ms</td>
      <td className="px-4 py-2">{log.region}</td>
      <td className="px-4 py-2">{log.error || "N/A"}</td>
    </tr>
  );
};
