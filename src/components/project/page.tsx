"use client";

import { useProject } from "@/hooks/useProject";
import { Chip, Column, Heading, Line, Row, SegmentedControl } from "@/ui/components";

type ProjectPageProps = {
  id: string;
};

export default function ProjectPage({ id }: ProjectPageProps) {
  const { project, loading } = useProject();

  return (
    <>
      <Row fill>
        <Column fillWidth>
          <Row
            fillWidth
            background="neutral-alpha-weak"
            paddingX="40"
            paddingTop="24"
            height={10}
            horizontal="start"
            vertical="start"
          >
            <Row vertical="center" horizontal="start" gap="8">
              <h1 className="heading-level-4 u-min-width-0">
                <div className="u-flex u-cross-center">
                  <span className="text u-trim-1" data-private="">
                    {loading && project === undefined ? "Loading..." : project?.name}
                  </span>
                </div>
              </h1>
              <Chip
                label={project?.$id ?? "Unknown"}
                iconButtonProps={{
                  tooltip: "More info",
                  tooltipPosition: "top",
                }}
              />
            </Row>
          </Row>

          <Line />

          <Row fillWidth paddingX="40" paddingTop="24" height={10} horizontal="start">
            <Column marginTop="24" fillWidth>
              <Heading variant="heading-default-l">Integrations</Heading>
              <Row marginTop="24" horizontal="start">
                <SegmentedControl
                  fillWidth={false}
                  buttons={[
                    {
                      label: "Platforms",
                      prefixIcon: "",
                      suffixIcon: "",
                      value: "platforms",
                    },
                    {
                      label: "APIs",
                      prefixIcon: "",
                      suffixIcon: "",
                      value: "apis",
                    },
                  ]}
                  onToggle={() => {}}
                  defaultSelected="platforms"
                />
              </Row>

              <Line marginY="24" />
            </Column>
          </Row>
          {project?.platforms.map((platform) => (
            <div key={platform.$id} className="u-flex u-cross-center">
              <span className="text u-trim-1" data-private="">
                {platform.name}
              </span>
            </div>
          ))}
        </Column>
      </Row>
    </>
  );
}
