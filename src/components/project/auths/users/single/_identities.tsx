"use client";
import React from "react";
import { Models } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { DataGridProvider, Table } from "@/ui/modules/data-grid";
import { useProjectStore } from "@/lib/store";
import { PageContainer, PageHeading } from "@/components/others";
import { EmptyState } from "@/components/_empty_state";
import { useSuspenseQuery } from "@tanstack/react-query";

const IdentityPage = () => {
  const project = useProjectStore.use.project?.();
  const sdk = useProjectStore.use.sdk?.();

  const authPath = `/project/${project?.$id}/authentication`;

  const fetcher = async () => {
    return await sdk.users.listIdentities();
  };

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["identities"],
    queryFn: fetcher,
  });

  const columns: ColumnDef<Models.Identity>[] = [
    {
      header: "ID",
      accessorKey: "$id",
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
        heading="Identities"
        description="Identities are the different ways you can authenticate with your account."
      />

      <DataGridProvider<Models.Identity>
        columns={columns}
        data={data.identities ?? []}
        rowCount={data.total}
        loading={isFetching}
      >
        <EmptyState
          show={data.total === 0 && !isFetching}
          title="No Identities"
          description="No identities have been created yet."
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

export default IdentityPage;
