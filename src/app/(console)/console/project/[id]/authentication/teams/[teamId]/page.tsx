import { PropsWithParams } from "@/types";
import React from "react";

interface TeamPageProps {
  id: string;
  teamId: string;
}

const TeamPage: React.FC<PropsWithParams<TeamPageProps>> = async ({ params }) => {
  const { id, teamId } = await params;

  return (
    <div>
      <h1>Team Page</h1>
      <p>Project ID: {id}</p>
      <p>Team ID: {teamId}</p>
    </div>
  );
};

export default TeamPage;
