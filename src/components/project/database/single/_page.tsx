"use client";

import { getDbPageState } from "@/state/page";

export const DatabaseSinglePage = () => {
  const { database } = getDbPageState();

  return <>{JSON.stringify(database)}</>;
};
