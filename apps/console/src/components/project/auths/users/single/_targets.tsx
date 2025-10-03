"use client";
import React from "react";
import { Models } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@nuvix/ui/components";
import { DataGridProvider, Table } from "@/ui/data-grid";
import { useProjectStore, useUserStore } from "@/lib/store";
import { EmptyState } from "@/components/_empty_state";
import { IDChip, PageContainer, PageHeading } from "@/components/others";
import { useSuspenseQuery } from "@tanstack/react-query";

const TargetPage = () => {
  const project = useProjectStore.use.project?.();
  const sdk = useProjectStore.use.sdk?.();
  const user = useUserStore.use.user?.();
  const { addToast } = useToast();

  const authPath = `/project/${project?.$id}/authentication`;

  const fetcher = async () => {
    return await sdk.users.listTargets(user!.$id);
  };

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["targets", user?.$id],
    queryFn: fetcher,
  });

  const columns: ColumnDef<Models.Target>[] = [
    {
      header: "Target ID",
      accessorKey: "$id",
      cell: ({ row }) => <IDChip id={row.original.$id} />,
      size: 240,
    },
    {
      header: "Target",
      accessorKey: "identifier",
      minSize: 240,
    },
    {
      header: "Type",
      accessorKey: "providerType",
      size: 71,
    },
    {
      header: "Provider",
      accessorKey: "providerId",
      size: 120,
    },
    {
      header: "Created",
      accessorKey: "$createdAt",
      cell: ({ row }) => new Date(row.original.$createdAt).toLocaleDateString(),
      size: 120,
    },
  ];

  return (
    <PageContainer>
      <PageHeading heading="Targets" description="Manage user's targets." />

      <DataGridProvider<Models.Target>
        columns={columns}
        data={data.data}
        rowCount={data.total}
        loading={isFetching}
      >
        <EmptyState
          show={data.total === 0 && !isFetching}
          title="No Targets"
          description="No targets have been created yet."
        />

        {data.total > 0 && (
          <>
            <Table interactive={false} />
          </>
        )}
      </DataGridProvider>
    </PageContainer>
  );
};

export default TargetPage;
