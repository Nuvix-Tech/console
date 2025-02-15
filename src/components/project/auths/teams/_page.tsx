"use client";
import { getProjectState } from "@/state/project-state";
import { Avatar, Column } from "@/ui/components";
import { Models, Query } from "@nuvix/console";
import React from "react";
import { Row } from "@/ui/components";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/ui/tooltip";
import { Text } from "@chakra-ui/react";
import { formatDate } from "@/lib/utils";
import { DataGrid, DataGridSkelton, SearchAndCreate } from "@/ui/modules/data-grid";
import { useSearchParams } from "next/navigation";
import { EmptySearch, EmptyState } from "@/ui/modules/layout";

export const TeamsPage = () => {
    const state = getProjectState();
    const { sdk, project } = state;
    const [loading, setLoading] = React.useState(true);
    const [teams, setTeams] = React.useState<Models.TeamList<any>>({
        teams: [],
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
            Query.orderDesc("")
        )
        const fetchTeams = async () => {
            const teams = await sdk.teams.list(queries, search ?? undefined);
            setTeams(teams);
            setLoading(false);
        };

        fetchTeams();
    }, [sdk, limit, page, search]);

    const authPath = `/console/project/${project?.$id}/authentication`

    const columns: ColumnDef<Models.Team<any>>[] = [
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
                href: (row) => `${authPath}/teams/${row.$id}`,
            },
        },
        {
            header: "Members",
            accessorKey: "total",
        },
        {
            header: "Created",
            accessorKey: "$createdAt",
            minSize: 300,
            cell(props) {
                const joined = formatDate(props.getValue<string>());
                return <Tooltip showArrow content={joined}>
                    <span>{joined}</span>
                </Tooltip>;
            },
        },
    ];

    return (
        <Column paddingX="16" fillWidth>
            <Row vertical="center" horizontal="start" marginBottom="24" marginTop="12" paddingX="8">
                <Text fontSize={'2xl'} as={'h2'} fontWeight={'semibold'}>Teams</Text>
            </Row>

            {loading && !teams.total ? (
                <DataGridSkelton />
            ) : (teams.total > 0 || !!search || page > 1) ? (
                <>
                    <SearchAndCreate
                        button={{ text: "Create Team" }}
                        placeholder="Search by name"
                    />

                    {teams.total > 0 ? (
                        <DataGrid<Models.Team<any>>
                            columns={columns}
                            data={teams.teams}
                            manualPagination
                            rowCount={teams.total}
                            loading={loading}
                            state={{ pagination: { pageIndex: page, pageSize: limit } }}
                        />
                    ) : (search && <EmptySearch
                        title={`Sorry, we couldn't find '${search}'`}
                        description="There are no teams that match your search."
                        clearSearch
                    />)}
                </>
            ) : <EmptyState title="No teams found" />}
        </Column>
    );
};