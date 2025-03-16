"use client";
import React, { useEffect, useState } from "react";
import { Models } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { Chip, Row, useToast } from "@/ui/components";
import { IconButton, Text } from "@chakra-ui/react";
import { DataGrid, DataGridSkelton } from "@/ui/modules/data-grid";
import { LuTrash2 } from "react-icons/lu";
import { useProjectStore, useUserStore } from "@/lib/store";
import { EmptyState } from "@/components/_empty_state";
import { PageContainer, PageHeading } from "@/components/others";

const SessionPage = () => {
  const [sessions, setSessions] = useState<Models.SessionList>({
    sessions: [],
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
    let sessions = await sdk!.users.listSessions(user?.$id!);
    setSessions(sessions!);
    setLoading(false);
  }

  useEffect(() => {
    if (!user && !sdk) return;
    get();
  }, [user, sdk]);

  const columns: ColumnDef<Models.Session>[] = [
    {
      header: "Browser and device",
      accessorKey: "userName",
      cell({ row }) {
        const session = row.original;
        return (
          <Row vertical="center" gap="4">
            <Text truncate lineClamp={2}>
              {session.clientName}
              {session.clientVersion} on {session.osName}
              {session.osVersion}
            </Text>
            {session.current ? <Chip label="current session" /> : null}
          </Row>
        );
      },
      size: 150,
    },
    {
      header: "Session",
      accessorKey: "clientType",
    },
    {
      header: "Location",
      accessorKey: "countryName",
    },
    {
      header: "IP",
      accessorKey: "ip",
    },
    {
      header: "",
      accessorKey: "$id",
      cell(props) {
        return (
          <IconButton
            size={"sm"}
            variant={"ghost"}
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <LuTrash2 />
          </IconButton>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeading heading="Sessions" description="Manage and view all active user sessions." />

      {loading && !sessions.total ? (
        <DataGridSkelton />
      ) : sessions.total > 0 ? (
        <DataGrid<Models.Session>
          columns={columns}
          data={sessions.sessions}
          rowCount={sessions.total}
          loading={loading}
          showPagination={true}
        />
      ) : (
        <EmptyState
          show
          title="No Active Sessions"
          description="There are currently no active sessions for this user."
        />
      )}
    </PageContainer>
  );
};

export default SessionPage;
