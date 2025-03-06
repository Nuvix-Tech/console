import { TeamPage } from "@/components/project/auths/teams";
import { PropsWithParams } from "@/types";
import React from "react";

interface TeamPageProps {
  id: string;
  teamId: string;
}

const _TeamPage: React.FC<PropsWithParams<TeamPageProps>> = async ({ params }) => {
  const { id, teamId } = await params;

  return <TeamPage id={teamId} />;
};

export default _TeamPage;
