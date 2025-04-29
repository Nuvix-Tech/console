import { Card, Column, Row, SmartLink, Tag, Text } from "@/ui/components";
import { IDChip } from "@/components/others";
import { useParams } from "next/navigation";
import { Database } from "lucide-react";
import { _Models } from "@/lib/external-sdk";

type DatabaseCardProps = {
  database: _Models.Schema;
};

export const DatabaseCard = ({ database }: DatabaseCardProps) => {
  const { id } = useParams();

  return (
    <SmartLink
      unstyled
      key={database.name}
      fillWidth
      href={
        database.type === "managed"
          ? `/project/${id}/database/schemas/${database.name}/tables`
          : `/project/${id}/d-schema/${database.name}`
      }
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
          {/* <Database className="absolute right-4 opacity-10 size-28 rotate-45 bottom-4 neutral-on-background-weak" /> */}
        </Column>
        <div onClick={(e) => e.preventDefault()} className="inline w-min">
          <IDChip id={database.name} hideIcon />
        </div>
      </Card>
    </SmartLink>
  );
};
