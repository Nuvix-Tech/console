"use client";
import { Background, Row } from "@nuvix/ui/components";
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
      <PageContainer>
        <Row
          position="relative"
          overflow="hidden"
          fillWidth
          minHeight={10}
          // background="neutral-alpha-weak"
          radius="l"
          horizontal="center"
          vertical="start"
        >
          <Background
            zIndex={0}
            position="absolute"
            color="neutral-alpha-weak"
            mask={{ cursor: false, radius: 10 }}
            gradient={{
              colorEnd: "static-transparent",
              colorStart: "neutral-alpha-weak",
              display: true,
              height: 100,
              opacity: 80,
              tilt: 170,
              width: 100,
              x: 0,
              y: 0,
            }}
            dots={{
              color: "accent-alpha-medium",
              display: true,
              opacity: 40,
              size: "4",
            }}
          />
          <TopInfo />
        </Row>
        <MainMetrics />
      </PageContainer>
    </>
  );
}
