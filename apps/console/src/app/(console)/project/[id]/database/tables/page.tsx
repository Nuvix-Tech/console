import React from "react";
import { TablesPage } from "@/components/project/database/tables";

export const metadata = {
  title: "Database Tables",
  description: "Manage your database tables",
};

export default function DatabaseTables() {
  return <TablesPage />;
}
