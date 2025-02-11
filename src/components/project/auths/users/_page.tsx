import { getProjectState } from "@/state/project-state";
import { Avatar, Skeleton } from "@/ui/components";
import { Models } from "@nuvix/console";
import React from "react";
import { Row, Text } from "@/ui/components";
import Table from "@/ui/modules/table/table";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/ui/tooltip";
import { SearchAndCreate } from "@/ui/modules/table";


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
      accessorKey: "status",
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
    },
    {
      header: "Last Activity",
      accessorKey: "accessedAt",
      cell(props) {
        return <Text variant="label-default-s">{props.getValue<string>() ?? "never"}</Text>;
      },
    },
  ];

  return (
    <div className="p-4">
      <Row vertical="center" horizontal="start" marginTop="24" paddingX="8">
        <Text variant="heading-strong-xl">Users</Text>
      </Row>

      <SearchAndCreate button={{ text: "Create User" }} />

      <Table<Models.User<any>> columns={columns} data={users.users} />
    </div>
  );
};



export { }