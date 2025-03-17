"use client";
import React from "react";
import { Models } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/ui/components";
import { DataGridProvider, Table } from "@/ui/modules/data-grid";
import { useProjectStore, useUserStore } from "@/lib/store";
import { EmptyState } from "@/components/_empty_state";
import { PageContainer, PageHeading } from "@/components/others";
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
    },
    {
      header: "Target",
      accessorKey: "identifier",
    },
    {
      header: "Type",
      accessorKey: "providerType",
    },
    {
      header: "Provider",
      accessorKey: "providerId",
    },
    {
      header: "Created",
      accessorKey: "$createdAt",
    },
  ];

  return (
    <PageContainer>
      <PageHeading
        heading="Targets"
        description="Manage authentication targets associated with this user. Targets represent the different authentication methods or providers linked to user accounts."
      />

      <DataGridProvider<Models.Target>
        columns={columns}
        data={data.targets}
        rowCount={data.total}
        loading={isFetching}
      >
        <EmptyState
          show={data.total === 0 && !isFetching}
          title="No Targets"
          description="No targets have been created yet."
        />

        {(data.total > 0) && (
          <>
            <Table />
          </>
        )}
      </DataGridProvider>
    </PageContainer>
  );
};

export default TargetPage;
