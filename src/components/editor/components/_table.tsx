import { ModelsX } from "@/lib/external-sdk";
import { useProjectStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { DataGrid } from "react-data-grid";


export const Table = ({ table }: { table: ModelsX.Table }) => {
    const sdk = useProjectStore.use.sdk();
    const columns = table.columns.map((c) => ({ key: c.name, name: c.name }));

    // const { data, isPending, isError } = useQuery({
    //     queryKey: ["table", "rows", table.name],
    //     queryFn: async () => {
    //         const rows = await sdk.schema.getRows(table.name, table.schema);
    //         return rows;
    //     },
    // });

    const rows: any[] = [];

    return <DataGrid rows={rows} columns={columns} />;
};

