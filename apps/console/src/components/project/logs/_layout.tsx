"use client";

import { useProjectStore } from "@/lib/store";

export const ApiLogsLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { setSidebar } = useProjectStore((state) => state);

  return children;
};
