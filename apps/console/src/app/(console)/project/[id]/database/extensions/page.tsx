import { ExtensionsPage } from "@/components/project/database/extensions";
import React from "react";

export const metadata = {
  title: "Database Extensions",
  description: "Manage your database extensions",
};

export default function DatabaseExtensions() {
  return <ExtensionsPage />;
}
