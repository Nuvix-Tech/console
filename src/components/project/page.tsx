"use client";
import { Background, Column, Row } from "@/ui/components";
import React, { useEffect } from "react";
import { useProjectStore } from "@/lib/store";
import { TopInfo, TopLeftInfo } from "./components";
import { PageContainer } from "../others";
import { Stack } from "@chakra-ui/react";

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
        <Stack
          width="full"
          gap={2}
          justifyContent="space-between"
          flexDirection={{
            base: "column",
            lg: "row",
          }}
          marginTop={"8"}
        >
          <Row
            position="relative"
            overflow="hidden"
            fillWidth
            minHeight={10}
            background="neutral-alpha-weak"
            radius="l-8"
            horizontal="center"
            vertical="start"
          >
            <Background
              zIndex={0}
              position="absolute"
              color="neutral-alpha-weak"
              mask={{ cursor: true }}
              gradient={{
                colorEnd: "static-transparent",
                colorStart: "brand-alpha-medium",
                display: true,
                height: 100,
                opacity: 60,
                tilt: 40,
                width: 150,
                x: 0,
                y: 0,
              }}
              dots={{
                color: "accent-alpha-medium",
                display: true,
                opacity: 80,
                size: "4",
              }}
              grid={{
                color: "accent-alpha-weak",
                display: true,
                opacity: 80,
              }}
            />
            <TopInfo />
          </Row>
          {/* <Stack width={{ base: "full", lg: "1/4" }}>
            <TopLeftInfo />
          </Stack> */}
        </Stack>
      </PageContainer>
    </>
  );
}
