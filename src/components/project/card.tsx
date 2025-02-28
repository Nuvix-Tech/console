import { Button, Card, Column, Icon, Row, Tag, Text } from "@/ui/components";
import type { Models } from "@nuvix/console";
import { useRouter } from "@bprogress/next";
import { IoIosAppstore } from "react-icons/io";
import { MdAndroid } from "react-icons/md";
import { RxCode } from "react-icons/rx";

export const ProjectCard = ({ project }: { project: Models.Project }) => {
  const { push } = useRouter();

  return (
    <Card
      key={project.$id}
      radius="l-4"
      direction="column"
      vertical="space-between"
      padding="l"
      minHeight={14}
      onClick={() => push(`/console/project/${project.$id}`)}
    >
      <Column gap="2" vertical="center">
        {project.platforms.length ? (
          <Text as={"span"} size="m">
            {project.platforms.length} APPS
          </Text>
        ) : null}
        <Text as={"h3"} size="xl">
          {project.name}
        </Text>
      </Column>

      <Row horizontal="space-between" vertical="center">
        {project.platforms.length ? (
          <Row gap="s" marginTop="l">
            {project.platforms.map((platform) => (
              <TagMapper key={platform.$id} type={platform.type} />
            ))}
          </Row>
        ) : (
          <Button href={`/console/project/${project.$id}/settings`} size="s" variant="secondary">
            Add app
          </Button>
        )}
      </Row>
    </Card>
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
