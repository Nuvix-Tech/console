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

const IdentityPage = () => {
  const [identities, setIdentities] = useState<Models.IdentityList>({
    identities: [],
    total: 0,
  });
  const { user } = getUserPageState();
  const [loading, setLoading] = React.useState(true);
  const { sdk, project } = getProjectState();
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
    <Column paddingX="16" fillWidth>
      <Row vertical="center" horizontal="start" marginBottom="24" marginTop="12" paddingX="8">
        <Text fontSize={"2xl"} as={"h2"} fontWeight={"semibold"}>
          Identities
        </Text>
      </Row>

      {loading && !identities.total ? (
        <DataGridSkelton />
      ) : identities.total > 0 ? (
        <DataGrid<Models.Identity>
          columns={columns}
          data={identities.identities}
          rowCount={identities.total}
          loading={loading}
          showPaggination={false}
        />
      ) : (
        <EmptyState title="No Identities" description="No identities have been created yet." />
      )}
    </Column>
  );
};

export default IdentityPage;
