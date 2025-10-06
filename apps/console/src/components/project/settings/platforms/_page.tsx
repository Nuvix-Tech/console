"use client";
import { PageContainer, PageHeading } from "@/components/others";
import { DataGridProvider, DateTimeColumn, Table } from "@/ui/data-grid";
import { Models, type PlatformType } from "@nuvix/console";
import { EmptyState } from "@/components";
import { useProjectStore } from "@/lib/store";
import { ColumnDef } from "@tanstack/react-table";
import { Icon } from "@nuvix/ui/components";
import { sdkForConsole } from "@/lib/sdk";
import { useQuery } from "@tanstack/react-query";
import { platformIcon } from "../../components/_utils";
import { rootKeys } from "@/lib/keys";
import { CreatePlatformButton } from "./_create";

const PlatformsPage: React.FC = () => {
  const { project } = useProjectStore((state) => state);

  const fetcher = () => {
    return sdkForConsole.projects.listPlatforms(project.$id);
  };

  const { data, isFetching } = useQuery({
    queryKey: rootKeys.platforms(project?.$id!),
    queryFn: fetcher,
    enabled: !!project?.$id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const path = `/project/${project?.$id}/s/apps`;

  const columns: ColumnDef<Models.Platform>[] = [
    {
      header: "Name",
      accessorKey: "name",
      minSize: 150,
      meta: {
        href: (row) => `${path}/${row.$id}`,
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      minSize: 100,
      cell({ getValue }) {
        const type = getValue<PlatformType>();
        return (
          <div className="capitalize flex items-center neutral-on-background-medium">
            <Icon name={platformIcon(type)} className="inline mr-2" onBackground="brand-medium" />
            {type}
          </div>
        );
      },
    },
    {
      header: "Identifier",
      accessorKey: "hostname",
      minSize: 200,
      cell({ row }) {
        const hostname = row.original.hostname;
        const key = row.original.key;
        return key || hostname;
      },
    },
    {
      header: "Last Updated",
      accessorKey: "$updatedAt",
      minSize: 200,
      cell({ getValue }) {
        return <DateTimeColumn getValue={getValue} />;
      },
    },
  ];

  const create = <CreatePlatformButton />;

  return (
    <PageContainer>
      <PageHeading
        heading="Platforms"
        description="Manage your project applications and configurations."
        right={create}
      />
      <DataGridProvider<Models.Platform>
        columns={columns}
        data={data?.data ?? []}
        loading={isFetching}
      >
        <EmptyState
          show={data?.total === 0 && !isFetching}
          title="Add your platforms"
          description="Add your project platforms to start integrating with various services."
          primaryComponent={create}
        />
        {data?.total! > 0 && !isFetching && <Table />}
      </DataGridProvider>
    </PageContainer>
  );
};

export { PlatformsPage };
