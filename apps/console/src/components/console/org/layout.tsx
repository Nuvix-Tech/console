"use client";

import { sdkForConsole } from "@/lib/sdk";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

export default function OrgLayout({ children, id }: { children: React.ReactNode; id: string }) {
  const { organizations } = sdkForConsole;
  const setOrganization = useAppStore.use.setOrganization();

  useEffect(() => {
    organizations.get(id).then((org) => {
      setOrganization(org);
    });
  }, [id]);

  return <>{children}</>;
}
