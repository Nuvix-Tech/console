"use client";
import { useProjectStore } from "@/lib/store";
import { useEffect } from "react";

export function StorageLayout({ children }: { children: React.ReactNode }) {
  const setSideBar = useProjectStore.use.setSidebar();

  useEffect(() => {
    setSideBar({
      title: "Storage",
      first: null,
      middle: null,
      last: null,
    });
  }, []);

  return children;
}
