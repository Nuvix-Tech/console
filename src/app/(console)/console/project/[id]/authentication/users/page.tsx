"use client";
import { getProjectState } from "@/state/project-state";
import { Avatar, Skeleton } from "@/ui/components";
import { Models } from "@nuvix/console";
import { usePathname } from "next/navigation";
import React, { Suspense } from "react";
import { Column, Icon, IconButton, Line, Row, Text, ToggleButton } from "@/ui/components";
import Table from "@/ui/modules/table/table";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/ui/tooltip";
import { SearchAndCreate } from "@/ui/modules/table";

const UsersPage: React.FC = () => {
  const state = getProjectState();
  const pathname = usePathname() ?? "";

  state.sidebar = (
    <Column fill paddingX="xs" gap="m">
      <Column fillWidth gap="4">
        <Text
          variant="body-default-xs"
          onBackground="neutral-weak"
          marginBottom="8"
          marginLeft="16"
        >
          MANAGE
        </Text>
        <ToggleButton fillWidth justifyContent="flex-start" selected={pathname === "users"}>
          <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
            Users
          </Row>
        </ToggleButton>
        <ToggleButton fillWidth justifyContent="flex-start" selected={pathname === "analytics"}>
          <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
            <Icon name="PiTrendUpDuotone" onBackground="neutral-weak" size="xs" />
            Audit Logs
          </Row>
        </ToggleButton>
      </Column>

      <Line />

      <Column fillWidth gap="4">
        <Text
          variant="body-default-xs"
          onBackground="neutral-weak"
          marginBottom="8"
          marginLeft="16"
          style={{
            textTransform: "uppercase",
          }}
        >
          Configuration
        </Text>
        <ToggleButton fillWidth justifyContent="flex-start" selected={false}>
          <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
            General
          </Row>
        </ToggleButton>
        <ToggleButton fillWidth justifyContent="flex-start" selected={pathname === "analytics"}>
          <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
            Authentication
          </Row>
        </ToggleButton>
      </Column>
    </Column>
  );

  return (
    <Suspense fallback={<Skeleton fill shape="block" />}>
      <SubPage />
    </Suspense>
  );
};

const SubPage = () => {
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

export default UsersPage;
