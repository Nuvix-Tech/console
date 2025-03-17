import { Chip, Column, Heading, Line, Row } from "@/ui/components";
import { useProjectStore } from "@/lib/store";
import { IDChip } from "@/components/others";
import { useRouter } from "@bprogress/next";

export const TopInfo = () => {
  const project = useProjectStore.use.project?.();
  const { push } = useRouter();

  return (
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

            <Line vert height={1.5} marginX="24" background="neutral-alpha-strong" />
          </>
        ) : null}
        {project?.platforms &&
          project?.platforms.slice(0, 3).map((platform) => (
            <Chip
              key={platform.$id}
              height={2.3}
              paddingX="12"
              selected={false}
              prefixIcon={<span className={platformIcon(platform.type)} aria-hidden="true"></span>}
              onClick={() => push(`/project/${project?.$id}/platforms/${platform.$id}`)}
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
            onClick={() => push(`/project/${project?.$id}/platforms`)}
            label={`+${project?.platforms.length - 3} more`}
            iconButtonProps={{
              tooltip: "More info",
              tooltipPosition: "top",
            }}
          />
        ) : null}
        {}

        <Chip
          height={2.3}
          paddingX="12"
          selected={false}
          prefixIcon={"plus"}
          onClick={() => push(`/project/${project?.$id}/platforms/create`)}
          label={"Add platform"}
          iconButtonProps={{
            tooltip: "Add platform",
            tooltipPosition: "top",
          }}
        />
      </Row>
    </Column>
  );
};

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
