"use client";
import React, { useState } from "react";
import { Models, Query } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { Row, useConfirm, useToast } from "@/ui/components";
import { Avatar } from "@/components/cui/avatar";
import { HStack, IconButton, Text } from "@chakra-ui/react";
import { Tooltip } from "@/components/cui/tooltip";
import { formatDate } from "@/lib/utils";
import { LuTrash2 } from "react-icons/lu";
import { DataGridProvider, Pagination, Search, SelectLimit, Table } from "@/ui/modules/data-grid";
import { useProjectStore, useTeamStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { PageContainer, PageHeading } from "@/components/others";
import { EmptyState } from "@/components";
import { useSuspenseQuery } from "@tanstack/react-query";

const MembersPage = () => {
  const sdk = useProjectStore.use.sdk?.();
  const project = useProjectStore.use.project?.();
  const team = useTeamStore.use.team?.();
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();
  const confirm = useConfirm();

  const { limit, page, search, hasQuery } = useSearchQuery();

  const authPath = `/project/${project?.$id}/authentication`;

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.teams.listMemberships(team?.$id!, queries, search ?? undefined);
  };

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["members", page, limit, search],
    queryFn: fetcher,
  });

  const onDeleteMembersip = async (member: Models.Membership) => {
    if (
      await confirm({
        title: "Delete Membership",
        description: `Are you sure you want to delete the membership of ${member.userName} from the team ${member.teamName}? This action cannot be undone.`,
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      setDeleting(true);
      try {
        await sdk!.teams.deleteMembership(member.teamId, member.$id);
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
            <Avatar size="md" src={sdk?.avatars.getInitials(props.getValue<string>(), 64, 64)} />
            <Text truncate>{props.getValue<string>()}</Text>
          </Row>
        );
      },
      meta: {
        href: (row) => `${authPath}/users/${row.userId}`,
      },
      size: 150,
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
      header: "Joined",
      accessorKey: "$createdAt",
      size: 150,
      cell(props) {
        const joined = formatDate(props.getValue<string>());
        return (
          <Tooltip showArrow content={joined}>
            <span>{joined}</span>
          </Tooltip>
        );
      },
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

  return (
    <PageContainer>
      <PageHeading heading="Members" description="Manage the members of this team." />

      <DataGridProvider<Models.Membership>
        columns={columns}
        data={data.memberships}
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
        />

        {(data.total > 0 || hasQuery) && (
          <>
            <HStack justifyContent="space-between" alignItems="center">
              <Search placeholder="Search by ID" />
            </HStack>
            <Table noResults={data.total === 0 && hasQuery} />

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

export default MembersPage;
