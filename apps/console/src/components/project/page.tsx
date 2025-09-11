"use client";
import React, { useEffect } from "react";
import { useProjectStore } from "@/lib/store";
import { TopInfo } from "./components";
import { PageContainer } from "../others";
import MainMetrics from "./components/_main_matrics";

type ProjectPageProps = {
  id: string;
};

export default function ProjectPage({ id }: ProjectPageProps) {
  const setSidebarNull = useProjectStore.use.setSidebarNull();

  useEffect(() => {
    setSidebarNull();
  }, []);

  return (
    <>
      <PageContainer gap="0">
        <TopInfo />
        <MainMetrics />
      </PageContainer>
    </>
  );
}
