import { DatabaseLayout } from "@/components/project/database";
import { Metadata } from "next";
import React, { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "Databases",
    template: "%s - Databases",
  },
  description: "Manage your project databases",
};

export default function ({ children }: PropsWithChildren) {
  return <DatabaseLayout>{children}</DatabaseLayout>;
}
