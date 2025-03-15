"use client";
import { getProjectState, projectState } from "@/state/project-state";
import { Avatar, Column } from "@/ui/components";
import { Models, Query } from "@nuvix/console";
import React from "react";
import { Row } from "@/ui/components";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/cui/tooltip";
import { Badge, Text } from "@chakra-ui/react";
import { formatDate } from "@/lib/utils";
import { DataGrid, DataGridSkelton, SearchAndCreate } from "@/ui/modules/data-grid";
import { useSearchParams } from "next/navigation";
import { EmptySearch } from "@/ui/modules/layout";
import { IDChip } from "@/components/others";
import { EmptyState } from "@/components";

const UsersPage = () => {
  const state = getProjectState();
  const { sdk, project, permissions } = state;
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<Models.UserList<any>>({
    users: [],
    total: 0,
  });
  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search");
  const { canCreateProjects } = permissions;

  projectState.sidebar.first = null;

  React.useEffect(() => {
    if (!sdk) return;
    setLoading(true);
    const queries: string[] = [];

    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    const fetchUsers = async () => {
      const users = await sdk.users.list(queries, search ?? undefined);
      setUsers(users);
      setLoading(false);
    };

    fetchUsers();
  }, [sdk, limit, page, search]);

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
    <Column paddingX="16" fillWidth>
      <Row vertical="center" horizontal="start" marginBottom="24" marginTop="12" paddingX="8">
        <Text fontSize={"2xl"} as={"h2"} fontWeight={"semibold"}>
          Users
        </Text>
      </Row>

      {loading && !users.total ? (
        <DataGridSkelton />
      ) : users.total > 0 || !!search || page > 1 ? (
        <>
          <SearchAndCreate
            button={{ text: "Create User", allowed: canCreateProjects }}
            placeholder="Search by name, email, phone or ID"
          />

          {users.total > 0 ? (
            <DataGrid<Models.User<any>>
              columns={columns}
              data={users.users}
              manualPagination
              rowCount={users.total}
              loading={loading}
              state={{ pagination: { pageIndex: page, pageSize: limit } }}
            />
          ) : (
            search && (
              <EmptySearch
                title={`Sorry, we couldn't find '${search}'`}
                description="There are no users that match your search."
                clearSearch
              />
            )
          )}
        </>
      ) : (
        <EmptyState show title="No Users" description="No users have been created yet." />
      )}
    </Column>
  );
};

export default UsersPage;
