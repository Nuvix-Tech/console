"use client";
import React, { useEffect, useState } from "react";
import { getUserPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { Models } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { Chip, Column, Row, useToast } from "@/ui/components";
import { Button, IconButton, Text } from "@chakra-ui/react";
import { DataGrid, DataGridSkelton } from "@/ui/modules/data-grid";
import { EmptyState } from "@/ui/modules/layout";
import { LuTrash2 } from "react-icons/lu";

const SessionPage = () => {
  const [sessions, setSessions] = useState<Models.SessionList>({
    sessions: [],
    total: 0,
  });
  const { user } = getUserPageState();
  const [loading, setLoading] = React.useState(true);
  const { sdk, project } = getProjectState();
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
    <Column paddingX="16" fillWidth>
      <Row vertical="center" horizontal="start" marginBottom="24" marginTop="12" paddingX="8">
        <Text fontSize={"2xl"} as={"h2"} fontWeight={"semibold"}>
          Sessions
        </Text>
      </Row>

      {loading && !sessions.total ? (
        <DataGridSkelton />
      ) : sessions.total > 0 ? (
        <DataGrid<Models.Session>
          columns={columns}
          data={sessions.sessions}
          rowCount={sessions.total}
          loading={loading}
          showPagination={false}
        />
      ) : (
        <EmptyState title="No Sessions" description="No sessions have been created yet." />
      )}
    </Column>
  );
};

export default SessionPage;
