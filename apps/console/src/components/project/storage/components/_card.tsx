import { IDChip } from "@/components/others";
import { Column, Text } from "@nuvix/ui/components";
import { Models } from "@nuvix/console";
import { Cloud } from "lucide-react";
import { useParams } from "next/navigation";
import { GridCard } from "@/ui/data-grid";

export const StorageCard = ({ bucket }: { bucket: Models.Bucket }) => {
  const { id } = useParams();

  return (
    <GridCard
      key={bucket.name}
      fillWidth
      href={`/project/${id}/buckets/${bucket.$id}`}
      minHeight={12}
    >
      <Column gap="2" vertical="center">
        <Text as={"h3"} variant="heading-strong-s">
          {bucket.name}
        </Text>
        {/* <Cloud className="absolute right-4 opacity-5 size-28 bottom-4 neutral-on-background-weak" /> */}
      </Column>
      <div onClick={(e) => e.preventDefault()} className="inline w-min">
        <IDChip id={bucket.$id} hideIcon />
      </div>
    </GridCard>
  );
};
