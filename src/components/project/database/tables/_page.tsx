"use client";

import { useProjectStore } from "@/lib/store";
import { useSchemaStore } from "@/lib/store/schema";
import { useSuspenseQuery } from "@tanstack/react-query";

export const TablesPage = () => {
  const { sdk } = useProjectStore();
  const { schema } = useSchemaStore();

  async function fetcher() {
    return sdk.schema.getTables("m_do");
  }

  const { data, isPending } = useSuspenseQuery({
    queryFn: fetcher,
    queryKey: ["tables"],
  });

  if (isPending) {
    return <div className="flex justify-center p-8">Loading tables...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database Tables</h1>
      <div className="text-sm text-gray-500 mb-6">Total tables: {data.total}</div>

      {data.tables.map((table) => (
        <div key={table.$id} className="mb-8 bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{table.name}</h2>
              <div className="text-sm text-gray-500">
                Schema: {table.schema} • Created: {new Date(table.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-2 py-1 rounded text-xs ${table.rls ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}
              >
                RLS: {table.rls ? "ON" : "OFF"}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs ${table.cls ? "bg-purple-100 text-purple-800" : "bg-gray-100"}`}
              >
                CLS: {table.cls ? "ON" : "OFF"}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attributes
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Default
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.columns.map((column) => (
                  <tr key={column.id}>
                    <td className="py-3 px-4 text-sm">
                      <div className="font-medium">{column.name}</div>
                      {column.primary_key && (
                        <span className="text-xs text-blue-600 mt-1">Primary Key</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {column.type}
                        {column.array ? "[]" : ""}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {column.not_null && (
                          <span className="px-2 py-1 bg-yellow-100 rounded">NOT NULL</span>
                        )}
                        {column.unique && (
                          <span className="px-2 py-1 bg-green-100 rounded">UNIQUE</span>
                        )}
                        {column.references && (
                          <span className="px-2 py-1 bg-purple-100 rounded">FOREIGN KEY</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {column.default !== null ? column.default : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {table.indexes?.length > 0 && (
            <div className="p-4 border-t">
              <h3 className="text-sm font-medium mb-2">Indexes ({table.indexes.length})</h3>
              <div className="text-xs text-gray-500">
                {table.indexes.map((index, idx) => (
                  <div key={idx} className="mb-1">
                    {JSON.stringify(index)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
