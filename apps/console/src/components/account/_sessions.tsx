"use client";
import React from "react";
import { Models } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { Chip, Row, Text, Button, useConfirm } from "@nuvix/ui/components";
import { DataGridProvider, Table } from "@/ui/data-grid";
import { EmptyState } from "@/components/_empty_state";
import { PageContainer, PageHeading } from "@/components/others";
import { useQuery } from "@tanstack/react-query";
import { sdkForConsole } from "@/lib/sdk";
import { toast } from "sonner";
import { useRouter } from "@bprogress/next";

const SessionPage = () => {
  const fetcher = async () => {
    return await sdkForConsole.account.listSessions();
  };
  const confirm = useConfirm();
  const { replace } = useRouter();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["account:sessions"],
    queryFn: fetcher,
  });

  async function onSignOutAll() {
    const isConfirmed = await confirm({
      title: "Sign Out All Sessions",
      description:
        "Are you sure you want to sign out from ALL devices and browsers where your account is logged in? This action cannot be undone.",
      confirm: { text: "Sign Out All" },
      cancel: { text: "Cancel" },
    });

    if (isConfirmed) {
      try {
        await sdkForConsole.account.deleteSessions();
        replace("/auth/login");
      } catch (error: any) {
        toast.error(error?.message || "Failed to sign out. Please try again.");
      }
    }
  }

  async function onSignOut(id: string, isCurrent?: boolean) {
    const isConfirmed = await confirm({
      title: "Remove Session",
      description:
        "This will sign you out of the selected device or browser. Do you wish to proceed?",
      confirm: { text: "Sign Out" },
    });

    if (isConfirmed) {
      try {
        await sdkForConsole.account.deleteSession(id);
        if (isCurrent) {
          replace("/auth/login");
        } else {
          await refetch();
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to sign out. Please try again.");
      }
    }
  }

  const columns: ColumnDef<Models.Session>[] = [
    {
      header: "Client",
      accessorKey: "userName",
      cell({ row }) {
        const session = row.original;
        return (
          <Row vertical="center" gap="4">
            <Text truncate variant="body-default-s">
              {session.clientName}
              {session.clientVersion} on {session.osName}
              {session.osVersion}
            </Text>
            {session.current ? (
              <Chip textSize="xs" selected={false} label="current session" />
            ) : null}
          </Row>
        );
      },
      minSize: 450,
    },
    {
      header: "Location",
      accessorKey: "countryName",
      maxSize: 200,
    },
    {
      header: "IP",
      accessorKey: "ip",
      maxSize: 200,
    },
    {
      header: "",
      accessorKey: "$id",
      cell({ getValue, row }) {
        return (
          <Button
            size="s"
            variant="secondary"
            onClick={() => onSignOut(getValue<string>(), row.original.current)}
          >
            Sign out
          </Button>
        );
      },
      maxSize: 200,
    },
  ];

  return (
    <PageContainer>
      <PageHeading
        heading="Sessions"
        right={
          <Button size="s" variant="secondary" onClick={onSignOutAll}>
            Sign out all sessions
          </Button>
        }
      />

      <DataGridProvider<Models.Session>
        columns={columns}
        data={data?.data ?? (data as any)?.sessions ?? []}
        rowCount={data?.total}
        loading={isLoading}
      >
        <EmptyState
          show={data?.total === 0 && !isLoading}
          title="No Active Sessions"
          description="There are currently no active sessions."
        />

        {((data?.data ?? (data as any)?.sessions)?.length ?? 0 > 0) && (
          <Table interactive={false} />
        )}
      </DataGridProvider>
    </PageContainer>
  );
};

export { SessionPage };
