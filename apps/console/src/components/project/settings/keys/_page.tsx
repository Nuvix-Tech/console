"use client";
import { EmptyState } from "@/components/_empty_state";
import { PageHeading } from "@/components/others";
import { rootKeys } from "@/lib/keys";
import { sdkForConsole } from "@/lib/sdk";
import { useProjectStore } from "@/lib/store";
import { DataGridProvider, DateTimeColumn, Table } from "@/ui/data-grid";
import { Models } from "@nuvix/console";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { CreateKeyButton } from "./components/_create";

export const KeysPage: React.FC = () => {
  const { project } = useProjectStore((state) => state);

  const fetcher = () => {
    return sdkForConsole.projects.listKeys(project.$id);
  };

  const { data, isFetching } = useQuery({
    queryKey: rootKeys.keys(project?.$id!),
    queryFn: fetcher,
    enabled: !!project?.$id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const path = `/project/${project?.$id}/s/keys`;

  const columns: ColumnDef<Models.Key>[] = [
    {
      header: "Name",
      accessorKey: "name",
      minSize: 150,
      meta: {
        href: (row) => `${path}/${row.$id}`,
      },
    },
    {
      header: "Last accessed",
      accessorKey: "accessedAt",
      minSize: 200,
      cell({ getValue }) {
        const value = getValue<string | null>();
        if (!value) {
          return <span className="neutral-on-background-medium">Never</span>;
        }
        return <DateTimeColumn getValue={getValue} />;
      },
    },
    {
      header: "Expiration Date",
      accessorKey: "expire",
      minSize: 200,
      cell({ getValue }) {
        const value = getValue<string | null>();
        if (!value) {
          return <span className="neutral-on-background-medium">Never</span>;
        }
        return <DateTimeColumn getValue={getValue} />;
      },
    },
    {
      header: "Scopes",
      accessorKey: "scopes",
      minSize: 200,
      cell({ getValue }) {
        return `${getValue<string[]>().length} Scopes`;
      },
    },
  ];

  const create = <CreateKeyButton />;

  return (
    <>
      <PageHeading
        heading="API Keys"
        description="Manage your API keys here."
        right={!(data?.total === 0) && create}
      />

      <DataGridProvider<Models.Key> columns={columns} data={data?.data ?? []} loading={isFetching}>
        <EmptyState
          show={data?.total === 0 && !isFetching}
          title="Add your API keys"
          description="Add your project API keys to start integrating with various services."
          primaryComponent={create}
        />
        {data?.total! > 0 && !isFetching && <Table />}
      </DataGridProvider>
    </>
  );
};
