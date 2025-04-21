import { useProjectStore } from "@/lib/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Table } from "./_table";

export const Editor = ({ table }: { table: string }) => {
    const sdk = useProjectStore.use.sdk();
    const fetcher = async () => sdk.schema.getTable(table, "public");

    const { data, isPending, isError } = useSuspenseQuery({
        queryKey: ["table", table],
        queryFn: fetcher,
    });

    return (
        <div className="flex flex-col h-full w-full p-4 overflow-hidden">
            {isPending && (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-gray-500">Loading tables...</div>
                </div>
            )}

            {isError && (
                <div className="flex items-center justify-center h-full bg-red-50 rounded-md p-6">
                    <div className="text-red-500">Error loading tables. Please try again.</div>
                </div>
            )}

            {data && <Table table={data} />}
        </div>
    );
};