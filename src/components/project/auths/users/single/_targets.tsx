"use client";
import React, { useEffect, useState } from "react";
import { getUserPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { Models } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { Chip, Column, Row, useToast } from "@/ui/components";
import { IconButton, Text } from "@chakra-ui/react";
import { DataGrid, DataGridSkelton } from "@/ui/modules/data-grid";
import { EmptyState } from "@/ui/modules/layout";
import { LuTrash2 } from "react-icons/lu";

const TargetPage = () => {
  const [targets, setTargets] = useState<Models.TargetList>({
    targets: [],
    total: 0,
  });
  const { user } = getUserPageState();
  const [loading, setLoading] = React.useState(true);
  const { sdk, project } = getProjectState();
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
    <Column paddingX="16" fillWidth>
      <Row vertical="center" horizontal="start" marginBottom="24" marginTop="12" paddingX="8">
        <Text fontSize={"2xl"} as={"h2"} fontWeight={"semibold"}>
          Targets
        </Text>
      </Row>

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
        <EmptyState title="No Targets" description="No targets have been created yet." />
      )}
    </Column>
  );
};

export default TargetPage;
