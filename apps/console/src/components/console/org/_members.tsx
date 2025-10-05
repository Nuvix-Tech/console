"use client";
import React, { useState } from "react";
import { Models, Query } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { Row, useConfirm, useToast } from "@nuvix/ui/components";
import { Avatar } from "@nuvix/cui/avatar";
import { HStack, IconButton, Text } from "@chakra-ui/react";
import { Tooltip } from "@nuvix/cui/tooltip";
import { LuTrash2 } from "react-icons/lu";
import { DataGridProvider, Pagination, Search, SelectLimit, Table } from "@/ui/data-grid";
import { useAppStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { CreateButton, PageContainer, PageHeading } from "@/components/others";
import { EmptyState } from "@/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InviteMember } from "./components/_invite_member";
import { sdkForConsole } from "@/lib/sdk";
import { Status } from "@nuvix/cui/status";
import { IS_PLATFORM } from "@/lib/constants";

const OrgMembersPage = () => {
  const { organization, permissions } = useAppStore((s) => s);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();
  const confirm = useConfirm();

  const { limit, page, search, hasQuery } = useSearchQuery();
  const { canUpdateTeams } = permissions();

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdkForConsole.organizations.listMemberships(
      organization?.$id!,
      queries,
      search ?? undefined,
    );
  };

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["org-members", page, limit, search],
    queryFn: fetcher,
  });

  const onDeleteMembersip = async (member: Models.Membership) => {
    if (
      await confirm({
        title: "Delete Membership",
        description: `Are you sure you want to delete the membership of ${member.userName} from this organization? This action cannot be undone.`,
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      setDeleting(true);
      try {
        await sdkForConsole.organizations.deleteMembership(member.teamId, member.$id);
        addToast({
          variant: "success",
          message: "Membership successfully deleted.",
        });
        await refetch();
      } catch (e: any) {
        addToast({
          variant: "danger",
          message: e.message,
        });
      } finally {
        setDeleting(false);
      }
    }
  };

  const columns: ColumnDef<Models.Membership>[] = [
    {
      header: "Name",
      accessorKey: "userName",
      cell(props) {
        return (
          <Row vertical="center" gap="12">
            <Avatar
              size="sm"
              src={sdkForConsole?.avatars.getInitials(props.getValue<string>(), 64, 64)}
            />
            <Text truncate>{props.getValue<string>()}</Text>
          </Row>
        );
      },
      size: 200,
    },
    {
      header: "Email",
      accessorKey: "userEmail",
      size: 250,
    },
    {
      header: "Roles",
      accessorFn: (row) => row.roles?.filter(Boolean).join(", "),
      cell(props) {
        return (
          <Tooltip showArrow content={props.getValue<string>()}>
            <span>{props.getValue<string>()}</span>
          </Tooltip>
        );
      },
    },
    {
      header: "mfa",
      accessorKey: "mfa",
      cell({ getValue }) {
        const is = getValue<boolean>();
        return <Status value={is ? "success" : "info"}>{is ? "enabled" : "disabled"}</Status>;
      },
      size: 120,
    },
    {
      header: "",
      accessorKey: "$id",
      cell(props) {
        return (
          <IconButton
            size={"sm"}
            variant={"ghost"}
            disabled={deleting}
            onClick={(e) => {
              e.preventDefault();
              onDeleteMembersip(props.row.original);
            }}
          >
            <LuTrash2 />
          </IconButton>
        );
      },
    },
  ];

  const create = IS_PLATFORM ? (
    <CreateButton
      hasPermission={true}
      label="Invite Member"
      component={InviteMember}
      extraProps={{ refetch }}
    />
  ) : undefined;

  return (
    <PageContainer>
      <PageHeading
        heading="Members"
        description="Manage the members of this organization."
        right={create}
      />

      <DataGridProvider<Models.Membership>
        columns={columns}
        data={data.data}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No members found"
          description="Add members to this team to collaborate and manage access control."
          primaryComponent={create}
        />

        {(data.total > 0 || hasQuery) && (
          <>
            <HStack justifyContent="space-between" alignItems="center">
              <Search placeholder="Search by ID" />
            </HStack>
            <Table noResults={data.total === 0 && hasQuery} interactive={false} />

            <HStack justifyContent="space-between" alignItems="center">
              <SelectLimit />
              <Pagination />
            </HStack>
          </>
        )}
      </DataGridProvider>
    </PageContainer>
  );
};

export default OrgMembersPage;
