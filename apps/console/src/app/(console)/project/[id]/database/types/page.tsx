import React from "react";
import { EnumeratedTypesPage } from "@/components/project/database/EnumeratedTypes";

export const metadata = {
  title: "Database Types",
  description: "Manage your database types",
};

export default function DatabaseTypes() {
  return <EnumeratedTypesPage />;
}
