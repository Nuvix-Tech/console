import { useProjectStore } from "@/lib/store";
import { ToggleButton } from "@/ui/components";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export const Sidebar = () => {
  const sdk = useProjectStore.use.sdk();
  const searchParam = useSearchParams();
  const currentTable = searchParam.get("table");
  const { push } = useRouter();

  async function fetcher() {
    return await sdk.schema.getTables("public");
  }

  const { data, isPending, isError } = useQuery({
    queryKey: ["list_tables"],
    queryFn: fetcher,
  });

  return (
    <>
      <div className="h-full w-full">
        {isPending && <div>Loading...</div>}
        {isError && <div>Error loading tables</div>}
        {data &&
          data.tables.length &&
          data.tables.map((table) => (
            <ToggleButton
              key={table.name}
              selected={table.name === currentTable}
              label={table.name}
              href={`?table=${table.name}`}
            />
          ))}
      </div>
    </>
  );
};
