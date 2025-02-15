"use client";
import { getProjectState } from "@/state/project-state";
import { Avatar, Column } from "@/ui/components";
import { Models, Query } from "@nuvix/console";
import React from "react";
import { Row } from "@/ui/components";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/ui/tooltip";
import { SearchAndCreate } from "@/ui/modules/table";
import { Badge, Text } from "@chakra-ui/react";
import { formatDate } from "@/lib/utils";
import { DataGrid } from "@/ui/modules/data-grid";
import { useSearchParams } from "next/navigation";

export const UsersPage = () => {
  const state = getProjectState();
  const { sdk, project } = state;
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<Models.UserList<any>>({
    users: [],
    total: 0,
  });
  const searchParams = useSearchParams();
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 12;
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const search = searchParams.get('search');

  React.useEffect(() => {
    if (!sdk) return;
    setLoading(true)
    const queries: string[] = [];

    queries.push(
      Query.limit(limit),
      Query.offset((page - 1) * limit),
    )
    const fetchUsers = async () => {
      const users = await sdk.users.list(queries, search ?? undefined);
      setUsers(users);
      setLoading(false);
    };

    fetchUsers();
  }, [sdk, limit, page, search]);

  const authPath = `/project/${project?.$id}/authentication`

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
      meta: {
        href: (row) => `${authPath}/user/${row.$id}`,
      },
      size: 150,
    },
    {
      header: "Identifiers",
      accessorFn: (row) => [row.email, row.phone]?.filter(Boolean).join(", "),
      cell(props) {
        return (
          <Tooltip content={props.getValue<string>()}>
            <span>{props.getValue<string>()}</span>
          </Tooltip>
        );
      },
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
            borderRadius={'2xl'}
            colorPalette={
              status === "blocked" ? "red" : status.startsWith("verified") ? "green" : "gray"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      header: "ID",
      accessorKey: "$id",
    },
    {
      header: "Labels",
      maxSize: 100,
      accessorKey: "labels",
    },
    {
      header: "Joined",
      accessorKey: "$createdAt",
      size: 150,
      cell(props) {
        return formatDate(props.getValue<string>());
      },
    },
    {
      header: "Last Activity",
      accessorKey: "accessedAt",
      cell(props) {
        return (
          formatDate(props.getValue<string>()) ?? "never"
        );
      },
    },
  ];

  return (
    <Column paddingX="16" fillWidth>
      <Row vertical="center" horizontal="start" marginBottom="24" marginTop="4" paddingX="8">
        <Text fontSize={'2xl'} as={'h2'} fontWeight={'bold'}>Users</Text>
      </Row>

      <SearchAndCreate button={{ text: "Create User" }} placeholder="Search by name, email, phone or ID" />

      <DataGrid<Models.User<any>>
        columns={columns}
        data={users.users}
        manualPagination
        rowCount={users.total}
        loading={loading}
        state={{
          pagination: {
            pageIndex: page,
            pageSize: limit
          }
        }}
      />
    </Column>
  );
};

export { };
