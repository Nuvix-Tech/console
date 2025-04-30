import { IDChip } from "@/components/others";
import { Card, Column, SmartLink, Text } from "@nuvix/ui/components";
import { Models } from "@nuvix/console";
import { Cloud } from "lucide-react";
import { useParams } from "next/navigation";

export const StorageCard = ({ bucket }: { bucket: Models.Bucket }) => {
  const { id } = useParams();

  return (
    <SmartLink unstyled key={bucket.name} fillWidth href={`/project/${id}/buckets/${bucket.$id}`}>
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
            {bucket.name}
          </Text>
          {/* <Cloud className="absolute right-4 opacity-5 size-28 bottom-4 neutral-on-background-weak" /> */}
        </Column>
        <div onClick={(e) => e.preventDefault()} className="inline w-min">
          <IDChip id={bucket.$id} hideIcon />
        </div>
      </Card>
    </SmartLink>
  );
};
