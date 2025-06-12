import React from "react";
import { PropsWithParams } from "@/types";
import { FunctionsPage } from "@/components/project/database/functions";

export const metadata = {
  title: "Database Functions",
  description: "Manage your database functions",
};

export default function DatabaseFunctions() {
  return <FunctionsPage />;
}
