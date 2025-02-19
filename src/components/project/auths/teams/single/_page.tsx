"use client";
import { Column } from "@/ui/components";
import React from "react";
import { UpdateName, UpdatePrefs } from "./components";

interface TeamProps {
  id: string;
}

const SingleTeam: React.FC<TeamProps> = ({ id }) => {
  return (
    <>
      <Column fillWidth gap="20" paddingX="12" paddingY="20">
        <UpdateName />
        <UpdatePrefs />
      </Column>
    </>
  );
};

export default SingleTeam;
