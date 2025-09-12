"use client";

import { useProjectStore } from "@/lib/store";
import { useEffect } from "react";

export const ApiLogsLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { setSidebar } = useProjectStore((state) => state);

  useEffect(() => {
    setSidebar({
      title: "API Logs",
      first: "hello",
      middle: null,
      last: null,
    });
  }, []);

  return children;
};
