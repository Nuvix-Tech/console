"use client";
import { Background, Column, Row } from "@/ui/components";
import React, { useEffect } from "react";
import { useProjectStore } from "@/lib/store";
import { TopInfo, TopLeftInfo } from "./components";
import { PageContainer } from "../others";
import { Stack } from "@chakra-ui/react";
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
          background="neutral-alpha-weak"
          radius="l-8"
          horizontal="center"
          vertical="start"
          marginTop="8"
        >
          <Background
            zIndex={0}
            position="absolute"
            color="neutral-alpha-weak"
            mask={{ cursor: false, radius: 10 }}
            gradient={{
              colorEnd: "static-transparent",
              colorStart: "brand-alpha-weak",
              display: true,
              height: 100,
              opacity: 60,
              tilt: 170,
              width: 150,
              x: 0,
              y: 0,
            }}
            dots={{
              color: "accent-alpha-medium",
              display: true,
              opacity: 30,
              size: "4",
            }}
            grid={{
              color: "accent-alpha-weak",
              display: true,
              height: "var(--static-space-16)",
              opacity: 30,
              width: "var(--static-space-16)",
            }}
          />
          <TopInfo />
        </Row>
        <MainMetrics />
      </PageContainer>
    </>
  );
}
