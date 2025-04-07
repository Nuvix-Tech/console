import { DatabaseLayout } from "@/components/project/database";
import { Metadata } from "next";
import React, { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "Document Schema",
    template: "%s - Document Schema",
  },
  description: "Manage your project document schemas",
};

export default function Layout({ children }: PropsWithChildren) {
  return <DatabaseLayout>{children}</DatabaseLayout>;
}
