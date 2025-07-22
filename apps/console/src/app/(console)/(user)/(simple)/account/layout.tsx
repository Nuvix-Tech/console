import { AccountLayout } from "@/components/account";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return <AccountLayout>{children}</AccountLayout>;
}
