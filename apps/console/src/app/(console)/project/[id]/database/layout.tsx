import { DatabaseLayout } from "@/components/project/schema";
import { Metadata } from "next";
import React, { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "Schemas",
    template: "%s - Database",
  },
  description: "Manage your project document schemas",
};

export default function Layout({ children }: PropsWithChildren) {
  return <DatabaseLayout>{children}</DatabaseLayout>;
}
