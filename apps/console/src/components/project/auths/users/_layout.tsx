"use client";
import { useProjectStore } from "@/lib/store";
import React, { useEffect } from "react";

const UsersLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setSidebarNull = useProjectStore.use.setSidebarNull();

  useEffect(() => setSidebarNull("last"), []);

  return <>{children}</>;
};

export default UsersLayout;
