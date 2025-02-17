import React from "react";

interface TeamProps {
  id: string;
}

const SingleTeam: React.FC<TeamProps> = ({ id }) => {
  return <div>{id}</div>;
};

export default SingleTeam;
