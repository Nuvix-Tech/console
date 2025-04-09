"use client";
import { useProjectStore } from "@/lib/store";
import { useEffect } from "react";

export function StorageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setSideBarNull = useProjectStore.use.setSidebarNull();

  useEffect(() => {
    setSideBarNull();
  }, []);

  return children;
}
