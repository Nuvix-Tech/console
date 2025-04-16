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
        >
          <Row
            position="relative"
            overflow="hidden"
            fillWidth
            height={20}
            background="neutral-alpha-weak"
            radius="l-8"
            horizontal="center"
            vertical="start"
          >
            <Background
              zIndex={0}
              position="absolute"
              color="neutral-alpha-weak"
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
                color: "neutral-alpha-weak",
                display: true,
                opacity: 80,
                size: "4",
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
