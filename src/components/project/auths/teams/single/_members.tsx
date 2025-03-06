"use client";
import React, { useEffect, useState } from "react";
import { getTeamPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { Models, Query } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { Column, Row, useConfirm, useToast } from "@/ui/components";
import { Avatar } from "@/components/cui/avatar";
import { IconButton, Text } from "@chakra-ui/react";
import { Tooltip } from "@/components/cui/tooltip";
import { formatDate } from "@/lib/utils";
import { LuTrash2 } from "react-icons/lu";
import { DataGrid, DataGridSkelton, SearchAndCreate } from "@/ui/modules/data-grid";
import { EmptyState, EmptySearch } from "@/ui/modules/layout";
import { useSearchParams } from "next/navigation";

const MembersPage = () => {
  const [members, setMembers] = useState<Models.MembershipList>({
    memberships: [],
    total: 0,
  });
  const { team } = getTeamPageState();
  const [loading, setLoading] = React.useState(true);
  const { sdk, project } = getProjectState();
  const { addToast } = useToast();
  const confirm = useConfirm();

  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search");

  const authPath = `/project/${project?.$id}/authentication`;

  async function get(queries?: string[], search?: string) {
    setLoading(true);
    let members = await sdk!.teams.listMemberships(team?.$id!, queries, search);
    setMembers(members!);
    setLoading(false);
  }

  useEffect(() => {
    if (!team && !sdk) return;
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit), Query.orderDesc(""));
    get(queries, search ?? undefined);
  }, [team, sdk, limit, page, search]);

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
      setLoading(true);
      try {
        await sdk!.teams.deleteMembership(member.teamId, member.$id);
        addToast({
          variant: "success",
          message: "Membership successfully deleted.",
        });
        await get();
      } catch (e: any) {
        addToast({
          variant: "danger",
          message: e.message,
        });
      } finally {
        setLoading(false);
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
            disabled={loading}
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
    <Column paddingX="16" fillWidth>
      <Row vertical="center" horizontal="start" marginBottom="24" marginTop="12" paddingX="8">
        <Text fontSize={"2xl"} as={"h2"} fontWeight={"semibold"}>
          Members
        </Text>
      </Row>

      {loading && !members.total ? (
        <DataGridSkelton />
      ) : members.total > 0 || !!search || page > 1 ? (
        <>
          <SearchAndCreate button={{ text: "Create Membership" }} placeholder="Search by ID" />

          {members.total > 0 ? (
            <DataGrid<Models.Membership>
              columns={columns}
              data={members.memberships}
              rowCount={members.total}
              loading={loading}
              manualPagination
              state={{ pagination: { pageIndex: page, pageSize: limit } }}
            />
          ) : (
            search && (
              <EmptySearch
                title={`Sorry, we couldn't find '${search}'`}
                description="There are no members that match your search."
                clearSearch
              />
            )
          )}
        </>
      ) : (
        <EmptyState title="No Members" description="No members have been created yet." />
      )}
    </Column>
  );
};

export default MembersPage;
