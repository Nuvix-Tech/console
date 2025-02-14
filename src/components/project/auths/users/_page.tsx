"use client";
import { getProjectState } from "@/state/project-state";
import { Avatar } from "@/ui/components";
import { Models } from "@nuvix/console";
import React from "react";
import { Row, Text } from "@/ui/components";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/ui/tooltip";
import { SearchAndCreate } from "@/ui/modules/table";
import { Badge } from "@chakra-ui/react";
import { formatDate } from "@/lib/utils";
import { DataGrid } from "@/ui/modules/data-grid";

export const UsersPage = () => {
  const state = getProjectState();
  const sdk = state.sdk;
  const [users, setUsers] = React.useState<Models.UserList<any>>({
    users: [],
    total: 0,
  });

  React.useEffect(() => {
    if (!sdk) return;

    const fetchUsers = async () => {
      const users = await sdk.users.list();
      setUsers(users);
    };

    fetchUsers();
  }, [sdk]);

  const columns: ColumnDef<Models.User<any>>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell(props) {
        return (
          <Row vertical="center" gap="12">
            <Avatar size="m" src={sdk?.avatars.getInitials(props.getValue<string>(), 64, 64)} />
            <Text variant="label-default-s">{props.getValue<string>()}</Text>
          </Row>
        );
      },
      size: 200,
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
      accessorKey: "labels",
    },
    {
      header: "Joined",
      accessorKey: "$createdAt",
      cell(props) {
        return <Text variant="label-default-s">{formatDate(props.getValue<string>())}</Text>;
      },
    },
    {
      header: "Last Activity",
      accessorKey: "accessedAt",
      cell(props) {
        return (
          <Text variant="label-default-s">{formatDate(props.getValue<string>()) ?? "never"}</Text>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <Row vertical="center" horizontal="start" marginTop="24" paddingX="8">
        <Text variant="heading-strong-xl">Users</Text>
      </Row>

      <SearchAndCreate button={{ text: "Create User" }} />

      <DataGrid<Models.User<any>>
        columns={columns}
        data={users.users}
        manualPagination
        rowCount={users.total}
      />
    </div>
  );
};

export { };
