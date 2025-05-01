import { useGetTables } from "@/data/tables/tables-query";
import { useProjectStore } from "@/lib/store";
import { Column, ToggleButton } from "@nuvix/ui/components";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { use, Suspense } from "react";

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
  const { push } = useRouter();

  const getTables = useGetTables({
    projectRef: project?.$id,
    sdk,
  });

  const data = use(getTables());

  return (
    <>
      <div className="h-full w-full">
        <Column gap="4" padding="12">
          {data &&
            data.map((table) => (
              <ToggleButton
                fillWidth
                justifyContent="flex-start"
                key={table.name}
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
