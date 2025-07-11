import { Row, Tag, Text } from "@nuvix/ui/components";
import { IDChip } from "@/components/others";
import { useParams } from "next/navigation";
import { _Models } from "@/lib/external-sdk";
import { GridCard } from "@/ui/data-grid";

type DatabaseCardProps = {
  database: _Models.Schema;
};

export const DatabaseCard = ({ database }: DatabaseCardProps) => {
  const { id } = useParams();

  return (
    <GridCard
      key={database.name}
      href={
        database.type === "managed"
          ? `/project/${id}/database/schemas/${database.name}/tables`
          : `/project/${id}/schema/${database.name}`
      }
      minHeight={12}
    >
      <Row gap="2" vertical="center" horizontal="space-between" fillWidth>
        <Text as={"h3"} variant="heading-strong-s">
          {database.name}
        </Text>
        <Tag variant="neutral">{database.type}</Tag>
      </Row>
      <div onClick={(e) => e.preventDefault()} className="inline w-min">
        <IDChip id={database.name} hideIcon />
      </div>
    </GridCard>
  );
};
