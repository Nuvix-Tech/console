"use client";
import { getProjectState, projectState } from "@/state/project-state";
import { Background, Chip, Column, Feedback, Heading, Line, Row, Skeleton } from "@/ui/components";
import React from "react";
import { IDChip } from "../others";

type ProjectPageProps = {
  id: string;
};

export default function ProjectPage({ id }: ProjectPageProps) {
  const state = getProjectState();
  const { project } = state;
  const { sidebar } = projectState;

  sidebar.first = sidebar.middle = sidebar.last = null;

  return (
    <>
      <Row fill>
        <Column fillWidth>
          <Row fillWidth paddingX="40" paddingTop="24" horizontal="start">
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
              {!project ? (
                <Skeleton fill shape="block" />
              ) : (
                <Column
                  zIndex={1}
                  maxWidth={"m"}
                  fill
                  horizontal="start"
                  vertical="start"
                  gap="16"
                  padding="24"
                >
                  <Row vertical="center" horizontal="start" fillWidth gap="8">
                    <Heading variant="heading-strong-xl">{project?.name}</Heading>
                    <IDChip id={project?.$id} />
                  </Row>
                  <Row vertical="center" horizontal="start" fillWidth gap="8">
                    {(project?.platforms.length ?? 0) > 0 ? (
                      <>
                        <Chip
                          height={2.3}
                          paddingX="12"
                          selected={false}
                          prefixIcon={<span className="icon-view-grid" aria-hidden="true"></span>}
                          label={`${project?.platforms.length ?? 0} ${project?.platforms.length === 1 ? "platform" : "platforms"}`}
                          iconButtonProps={{
                            tooltip: "More info",
                            tooltipPosition: "top",
                          }}
                        />

                        <Line vert height={1.5} marginX="24" />
                      </>
                    ) : null}
                    {project?.platforms &&
                      project?.platforms.slice(0, 3).map((platform) => (
                        <Chip
                          key={platform.$id}
                          height={2.3}
                          paddingX="12"
                          selected={false}
                          prefixIcon={
                            <span className={platformIcon(platform.type)} aria-hidden="true"></span>
                          }
                          label={platform.name}
                          iconButtonProps={{
                            tooltip: "More info",
                            tooltipPosition: "top",
                          }}
                        />
                      ))}

                    {project?.platforms.length && project?.platforms.length > 3 ? (
                      <Chip
                        height={2.3}
                        paddingX="12"
                        selected={false}
                        label={`+${project?.platforms.length - 3} more`}
                        iconButtonProps={{
                          tooltip: "More info",
                          tooltipPosition: "top",
                        }}
                      />
                    ) : null}

                    <Chip
                      height={2.3}
                      paddingX="12"
                      selected={false}
                      prefixIcon={"plus"}
                      label={"Add platform"}
                      iconButtonProps={{
                        tooltip: "Add platform",
                        tooltipPosition: "top",
                      }}
                    />
                  </Row>
                </Column>
              )}
            </Row>
          </Row>

          <Row fillWidth paddingX="40" marginTop="160" paddingTop="48" horizontal="start">
            <Feedback
              variant="info"
              icon
              title="Project Overview Will be Available Soon"
              description="This page will provide insights into your project's performance, including key metrics and trends."
            />
          </Row>
        </Column>
      </Row>
    </>
  );
}

const platformIcon = (platform: string) => {
  switch (platform) {
    case "web":
      return "icon-code";
    case "android":
      return "icon-android";
    case "ios":
      return "icon-ios";
    case "desktop":
      return "icon-desktop";
    default:
      return "icon-view-grid";
  }
};
