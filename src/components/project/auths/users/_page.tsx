"use client";
import { getProjectState, projectState } from "@/state/project-state";
import { Avatar, Column } from "@/ui/components";
import { Models, Query } from "@nuvix/console";
import React from "react";
import { Row } from "@/ui/components";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/cui/tooltip";
import { Badge, HStack, Text } from "@chakra-ui/react";
import { formatDate } from "@/lib/utils";
import { DataGridProvider, DataGridSkelton, Search, Table } from "@/ui/modules/data-grid";
import { CreateButton, IDChip, PageContainer, PageHeading } from "@/components/others";
import { EmptyState } from "@/components";
import { useQuery } from "@/hooks/useQuery";
import { useSuspenseQuery } from "@tanstack/react-query";

const UsersPage = () => {
  const state = getProjectState();
  const { sdk, project, permissions } = state;
  const { limit, page, search, hasQuery } = useQuery();
  const { canCreateUsers } = permissions;

  projectState.sidebar.first = null;

  const fetcher = React.useCallback(async () => {
    if (!sdk) {
      return new Promise<never>(() => { });
    }
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.users.list(queries, search ?? undefined);
  }, []);

  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: [sdk, limit, page, search],
    queryFn: fetcher
  });

  const users = data ?? {
    users: [],
    total: 0,
  };
  console.log(data, isLoading, error);

  const authPath = `/project/${project?.$id}/authentication`;

  const columns: ColumnDef<Models.User<any>>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell(props) {
        return (
          <Row vertical="center" gap="12">
            <Avatar size="m" src={sdk?.avatars.getInitials(props.getValue<string>(), 64, 64)} />
            <Text>{props.getValue<string>()}</Text>
          </Row>
        );
      },
      size: 150,
      meta: {
        href: (row) => `${authPath}/users/${row.$id}`,
      },
    },
    {
      header: "Identifiers",
      accessorFn: (row) => [row.email, row.phone]?.filter(Boolean).join(", "),
      cell(props) {
        return (
          <Tooltip showArrow content={props.getValue<string>()}>
            <span>{props.getValue<string>()}</span>
          </Tooltip>
        );
      },
    },
    {
      header: "User ID",
      accessorKey: "$id",
      cell(props) {
        return <IDChip id={props.getValue<string>().slice(0, 12) + "..."} hideIcon />;
      },
      size: 160,
    },
    {
      header: "Status",
      accessorFn: (row) => {
        if (!row.status) {
          return "blocked";
        }
        if (row.email && row.phone) {
          if (row.emailVerification && row.phoneVerification) {
            return "verified";
          }
          return "unverfied";
        } else if (row.email) {
          return row.emailVerification ? "verified email" : "unverfied";
        } else if (row.phone) {
          return row.phoneVerification ? "verified phone" : "unverfied";
        }
        return "active";
      },
      cell(props) {
        const status = props.getValue<string>();
        return (
          <Badge
            variant="subtle"
            size="lg"
            borderRadius={"2xl"}
            colorPalette={
              status === "blocked" ? "red" : status.startsWith("verified") ? "green" : "slate"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    // {
    //   header: "Labels",
    //   maxSize: 100,
    //   accessorKey: "labels",
    // },
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
      header: "Last Activity",
      accessorKey: "accessedAt",
      cell(props) {
        const date = formatDate(props.getValue<string>());
        return (
          <Tooltip showArrow content={date} disabled={!date}>
            <span>{date ?? "never"}</span>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeading
        heading="Users"
        description="Manage your project’s users."
        right={<CreateButton hasPermission={canCreateUsers} label="Create User" />}
      />

      <DataGridProvider<Models.User<any>>
        columns={columns}
        data={data?.users ?? []}
        manualPagination
        rowCount={data?.total}
        loading={isLoading}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
      >
        {/* <DataGridSkelton loading={loading && !users.total && !hasQuery} /> */}

        <EmptyState
          show={users.total === 0 && !isLoading && !hasQuery}
          title="No Users"
          description="No users have been created yet."
        />

        {(users.total > 0 || hasQuery) && (
          <>
            <HStack mb="6" justifyContent="space-between" alignItems="center">
              <Search placeholder="Search by name, email, phone or ID" />
            </HStack>
            <Table noResults={users.total === 0 && hasQuery} />
            {/* <PaginationWrapper>
              <SelectLimit />
              <Pagination />
            </PaginationWrapper> */}
          </>
        )}
      </DataGridProvider>
    </PageContainer>
  );
};

export default UsersPage;
