import { Models } from "@nuvix/console";
import { Card, Column, Row, SmartLink, Tag, Text } from "@/ui/components";
import { IDChip } from "@/components/others";
import { useParams } from "next/navigation";
import { Database } from "lucide-react";

type DatabaseCardProps = {
  database: Models.Database;
};

export const DatabaseCard = ({ database }: DatabaseCardProps) => {
  const { id } = useParams();

  return (
    <SmartLink
      unstyled
      key={database.$id}
      fillWidth
      href={`/project/${id}/databases/${database.$id}`}
    >
      <Card
        radius="l-4"
        direction="column"
        vertical="space-between"
        padding="l"
        background="neutral-alpha-weak"
        fillWidth
        position="relative"
        minHeight={14}
      >
        <Column gap="2" vertical="center">
          <Text as={"h3"} size="xl" onBackground="neutral-strong">
            {database.name}
          </Text>
          <Database className="absolute right-4 opacity-10 size-28 rotate-45 bottom-4 neutral-on-background-weak" />
        </Column>
        <div onClick={(e) => e.preventDefault()} className="inline w-min">
          <IDChip id={database.$id} hideIcon />
        </div>
      </Card>
    </SmartLink>
  );
};
