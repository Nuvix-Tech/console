import { Column, Icon, Row, Tag, Text } from "@nuvix/ui/components";
import type { Models } from "@nuvix/console";
import { GridCard } from "@/ui/data-grid";

export const ProjectCard = ({ project }: { project: Models.Project }) => {
  const platformsCount = project.platforms.length;

  return (
    <GridCard
      key={project.$id}
      minHeight={12}
      href={`/project/${project.$id}`}
      className="group/pcard"
    >
      <Column gap="2" vertical="center" horizontal="start" fillWidth>
        <Text as={"span"} size="m" onBackground="neutral-weak">
          {platformsCount ? (platformsCount > 1 ? `${platformsCount} apps` : "app") : "no apps"}
        </Text>
        <Row horizontal="space-between" vertical="center" fillWidth>
          <Text as={"h3"} variant="label-strong-l">
            {project.name}
          </Text>
          <Tag size="m" marginTop="4">
            {"NANO"}
          </Tag>
        </Row>
      </Column>

      <Row
        horizontal="space-between"
        vertical="center"
        className={platformsCount ? "" : "group-hover/pcard:!justify-end transition-all "}
        fillWidth
      >
        {platformsCount !== 0 && (
          <Row gap="s" marginTop="l">
            {project.platforms.map((platform) => (
              <TagMapper key={platform.$id} type={platform.type} />
            ))}
          </Row>
        )}
        {/* <Icon name="chevronRight" onBackground="neutral-weak" /> */}
      </Row>
    </GridCard>
  );
};

const TagMapper = ({ type }: { type: string }) => {
  const comp = ({ name, icon }: { name: string; icon: any }) => (
    <Tag size="l">
      <span className={`icon-${icon}`} aria-hidden="true"></span>
      <Text marginLeft="4">{name}</Text>
    </Tag>
  );

  switch (type) {
    case "web":
      return comp({ name: "Web", icon: "code" });
    case "android":
      return comp({ name: "Android", icon: "android" });
    case "ios":
      return comp({ name: "iOS", icon: "ios" });
    default:
      return null;
  }
};
