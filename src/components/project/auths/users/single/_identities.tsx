"use client";
import React, { useEffect, useState } from "react";
import { Models } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/ui/components";
import { DataGrid, DataGridSkelton } from "@/ui/modules/data-grid";
import { useProjectStore, useUserStore } from "@/lib/store";
import { PageContainer, PageHeading } from "@/components/others";
import { EmptyState } from "@/components/_empty_state";

const IdentityPage = () => {
  const [identities, setIdentities] = useState<Models.IdentityList>({
    identities: [],
    total: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const project = useProjectStore.use.project?.();
  const sdk = useProjectStore.use.sdk?.();
  const user = useUserStore.use.user?.();
  const { addToast } = useToast();

  const authPath = `/project/${project?.$id}/authentication`;

  async function get() {
    setLoading(true);
    let identities = await sdk!.users.listIdentities();
    setIdentities(identities!);
    setLoading(false);
  }

  useEffect(() => {
    if (!user && !sdk) return;
    get();
  }, [user, sdk]);

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

      {loading && !identities.total ? (
        <DataGridSkelton />
      ) : identities.total > 0 ? (
        <DataGrid<Models.Identity>
          columns={columns}
          data={identities.identities}
          rowCount={identities.total}
          loading={loading}
          showPagination={false}
        />
      ) : (
        <EmptyState show title="No Identities" description="No identities have been created yet." />
      )}
    </PageContainer>
  );
};

export default IdentityPage;
