import React from "react";
import { PropsWithParams } from "@/types";
import { IndexesPage } from "@/components/project/database/indexes";

export const metadata = {
  title: "Database Indexes",
  description: "Manage your database indexes",
};

export default function DatabaseIndexes() {
  return <IndexesPage />;
}
