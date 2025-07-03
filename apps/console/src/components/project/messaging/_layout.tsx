"use client";
import { useProjectStore } from "@/lib/store";
import { PropsWithChildren, useEffect } from "react";
import { MessagingSidebar } from "./components";

export const MessagingLayout = ({ children }: PropsWithChildren) => {
  const { setSidebar } = useProjectStore((state) => state);

  const last = <MessagingSidebar />;

  useEffect(() => {
    setSidebar({
      title: "Messaging",
      first: null,
      middle: null,
      last,
    });
  }, [setSidebar]);

  return children;
};
