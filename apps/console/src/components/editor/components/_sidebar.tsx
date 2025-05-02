import { useGetTables } from "@/data/tables/tables-query";
import { useProjectStore } from "@/lib/store";
import { Column, ToggleButton } from "@nuvix/ui/components";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { use, Suspense, useState, useEffect } from "react";

export const Sidebar = () => {
  return (
    <>
      <Suspense fallback={"loading..."}>
        <Check />
      </Suspense>
    </>
  );
};

const Check = () => {
  const { project, sdk } = useProjectStore();
  const searchParam = useSearchParams();
  const currentTable = searchParam.get("table");
  const [data, setData] = useState(null as any);
  const { push } = useRouter();

  const getTables = useGetTables({
    projectRef: project?.$id,
    sdk,
  });

  useEffect(() => {
    async function calll() {
      if (!data) {
        const data = await getTables();
        setData(data);
      }
    }
    calll();
  }, [getTables]);

  return (
    <>
      <div className="h-full w-full overflow-x-auto">
        <Column gap="4" padding="12">
          {data &&
            data.map((table: any) => (
              <ToggleButton
                fillWidth
                justifyContent="flex-start"
                key={table.id}
                selected={table.name === currentTable}
                label={table.name}
                href={`?table=${table.id}`}
              />
            ))}
        </Column>
      </div>
    </>
  );
};
