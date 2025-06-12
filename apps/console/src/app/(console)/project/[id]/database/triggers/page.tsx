import React from "react";
import { TriggersPage } from "@/components/project/database/triggers";

export const metadata = {
  title: "Database Triggers",
  description: "Manage your database triggers",
};

export default function DatabaseTriggers() {
  return <TriggersPage />;
}
