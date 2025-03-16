"use client";
import React, { useEffect, useState } from "react";
import { Models } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/ui/components";
import { DataGrid, DataGridSkelton } from "@/ui/modules/data-grid";
import { useProjectStore, useUserStore } from "@/lib/store";
import { EmptyState } from "@/components/_empty_state";
import { PageContainer, PageHeading } from "@/components/others";

const TargetPage = () => {
  const [targets, setTargets] = useState<Models.TargetList>({
    targets: [],
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
    let targets = await sdk!.users.listTargets(user?.$id!);
    setTargets(targets!);
    setLoading(false);
  }

  useEffect(() => {
    if (!user && !sdk) return;
    get();
  }, [user, sdk]);

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

      {loading && !targets.total ? (
        <DataGridSkelton />
      ) : targets.total > 0 ? (
        <DataGrid<Models.Target>
          columns={columns}
          data={targets.targets}
          rowCount={targets.total}
          loading={loading}
          showPagination={false}
        />
      ) : (
        <EmptyState show title="No Targets" description="No targets have been created yet." />
      )}
    </PageContainer>
  );
};

export default TargetPage;
