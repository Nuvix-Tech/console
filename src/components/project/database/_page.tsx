"use client";
import { getProjectState } from "@/state/project-state";
import { Models } from "@nuvix/console";
import Link from "next/link";
import { useEffect, useState } from "react";

export function DatabasePage() {
  const { project, sdk } = getProjectState();
  const [databases, setDatabases] = useState<Models.DatabaseList>({
    databases: [],
    total: 0,
  });

  useEffect(() => {
    if (!sdk) return;
    const fetchDatabases = async () => {
      try {
        const data = await sdk.databases.list();
        setDatabases(data);
      } catch (error) {
        console.error("Error fetching databases:", error);
      }
    };

    fetchDatabases();
  }, [sdk]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Databases</h1>

      <ul>
        {databases.databases.map((db) => (
          <li key={db.$id} className="mb-2">
            <Link href={`/console/project/${project?.$id}/databases/${db.$id}`}>{db.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
