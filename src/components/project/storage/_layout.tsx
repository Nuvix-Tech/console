"use client";

import { useProjectStore } from "@/lib/store";
import { useEffect } from "react";
import { StorageSidebar } from "./components/_sidebar";

export function StorageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setSideBar = useProjectStore.use.setSidebar();

  useEffect(() => {
    setSideBar({
      first: <StorageSidebar />,
      middle: null,
      last: null,
    });
  }, []);

  return children;
}
