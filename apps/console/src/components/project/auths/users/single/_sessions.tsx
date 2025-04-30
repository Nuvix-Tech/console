"use client";
import React from "react";
import { Models } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { Chip, Row, useToast } from "@nuvix/ui/components";
import { IconButton, Text } from "@chakra-ui/react";
import { DataGridProvider, Table } from "@/ui/data-grid";
import { LuTrash2 } from "react-icons/lu";
import { useProjectStore, useUserStore } from "@/lib/store";
import { EmptyState } from "@/components/_empty_state";
import { PageContainer, PageHeading } from "@/components/others";
import { useSuspenseQuery } from "@tanstack/react-query";

const SessionPage = () => {
  const project = useProjectStore.use.project?.();
  const sdk = useProjectStore.use.sdk?.();
  const user = useUserStore.use.user?.();
  const { addToast } = useToast();

  const authPath = `/project/${project?.$id}/authentication`;

  const fetcher = async () => {
    return await sdk.users.listSessions(user!.$id);
  };

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["sessions", user?.$id],
    queryFn: fetcher,
  });

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

      <DataGridProvider<Models.Session>
        columns={columns}
        data={data.sessions}
        rowCount={data.total}
        loading={isFetching}
      >
        <EmptyState
          show={data.total === 0 && !isFetching}
          title="No Active Sessions"
          description="There are currently no active sessions for this user."
        />

        {data.total > 0 && (
          <>
            <Table />
          </>
        )}
      </DataGridProvider>
    </PageContainer>
  );
};

export default SessionPage;
