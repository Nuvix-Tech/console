// "use client";
// import React, { useEffect, useState } from "react";
// import { getUserPageState } from "@/state/page";
// import { getProjectState } from "@/state/project-state";
// import { Models } from "@nuvix/console";
// import { ColumnDef } from "@tanstack/react-table";
// import { Column, Row, useToast } from "@/ui/components";
// import { Avatar } from "@/components/ui/avatar";
// import { IconButton, Text } from "@chakra-ui/react";
// import { Tooltip } from "@/components/ui/tooltip";
// import { formatDate } from "@/lib/utils";
// import { LuTrash2 } from "react-icons/lu";
// import { DataGrid, DataGridSkelton } from "@/ui/modules/data-grid";
// import { EmptyState } from "@/ui/modules/layout";

// const SessionsPage = () => {
//   const [sessions, setSessions] = useState<Models.SessionList>({
//     sessions: [],
//     total: 0
//   })
//   const { user } = getUserPageState();
//   const [loading, setLoading] = React.useState(true);
//   const { sdk, project } = getProjectState();
//   const { addToast } = useToast();

//   const authPath = `/console/project/${project?.$id}/authentication`;

//   async function get() {
//     setLoading(true);
//     let sessions = await sdk!.users.listSessions(user?.$id!);
//     setSessions(sessions!)
//     setLoading(false);
//   }

//   useEffect(() => {
//     if (!user && !sdk) return;
//     get()
//   }, [user, sdk])

//   const columns: ColumnDef<Models.Session>[] = [
//     {
//       header: "Client",
//       accessorKey: "userName",
//       cell(props) {
//         return (
//           <Row vertical="center" gap="12">
//             <Avatar size="md" src={sdk?.avatars.getInitials(props.getValue<string>(), 64, 64)} />
//             <Text truncate>{props.getValue<string>()}</Text>
//           </Row>
//         );
//       },
//       size: 150,
//     },
//     {
//       header: "Roles",
//       accessorFn: (row) => row.roles?.filter(Boolean).join(", "),
//       cell(props) {
//         return (
//           <Tooltip showArrow content={props.getValue<string>()}>
//             <span>{props.getValue<string>()}</span>
//           </Tooltip>
//         );
//       },
//     },
//     {
//       header: "Joined",
//       accessorKey: "$createdAt",
//       size: 150,
//       cell(props) {
//         const joined = formatDate(props.getValue<string>());
//         return (
//           <Tooltip showArrow content={joined}>
//             <span>{joined}</span>
//           </Tooltip>
//         );
//       },
//     },
//     {
//       header: "",
//       accessorKey: "$id",
//       cell(props) {
//         return (
//           <IconButton
//             disabled={loading}
//             onClick={() => onDeleteMembersip(props.row.original.teamId, props.row.original.$id)}
//           >
//             <LuTrash2 />
//           </IconButton>
//         );
//       },
//     },
//   ];

//   return (
//     <Column paddingX="16" fillWidth>
//       <Row vertical="center" horizontal="start" marginBottom="24" marginTop="12" paddingX="8">
//         <Text fontSize={"2xl"} as={"h2"} fontWeight={"semibold"}>
//           Sessions
//         </Text>
//       </Row>

//       {loading && !sessions.total ? (
//         <DataGridSkelton />
//       ) : sessions.total > 0 ? (
//         <DataGrid<Models.Membership>
//           columns={columns}
//           data={sessions.sessions}
//           rowCount={sessions.total}
//           loading={loading}
//           showPaggination={false}
//         />
//       ) : (
//         <EmptyState title="No Sessions" description="No sessions have been created yet." />
//       )}
//     </Column>
//   )
// }

// export default MembershipPage;
