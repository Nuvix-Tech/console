import {
  DropdownWrapper,
  Icon,
  IconButton,
  Option,
  Row,
  Tag,
  Text,
  useConfirm,
} from "@nuvix/ui/components";
import { IDChip } from "@/components/others";
import { useParams } from "next/navigation";
import { _Models } from "@/lib/external-sdk";
import { GridCard } from "@/ui/data-grid";
import { MoreVertical } from "lucide-react";
import React from "react";
import { useSchemaDeleteMutation } from "@/data/database/schema-delete-mutation";
import { useProjectStore } from "@/lib/store";
import { toast } from "sonner";

type DatabaseCardProps = {
  database: _Models.Schema;
};

export const DatabaseCard = ({ database }: DatabaseCardProps) => {
  const { id } = useParams();

  const confirm = useConfirm();
  const { sdk } = useProjectStore((s) => s);
  const { mutateAsync } = useSchemaDeleteMutation({
    onSuccess: () => {
      toast.success(`Schema '${database.name}' deleted successfully.`);
    },
  });

  const handleDelete = async (database: _Models.Schema) => {
    const ok = await confirm({
      title: `Are you sure you want to delete the schema "${database.name}"?`,
      description: "This action cannot be undone.",
      confirm: {
        text: "Delete",
        variant: "danger",
      },
      input: {
        label: "Please type the database name to confirm.",
        placeholder: `Type '${database.name}' to confirm`,
        validate: (v: string) => v === database.name || "Names do not match",
      },
    });
    if (!ok) return;

    await mutateAsync({ name: database.name, projectRef: id as string, sdk });
  };

  return (
    <GridCard
      key={database.name}
      href={
        database.type !== "document"
          ? `/project/${id}/database/tables?schema=${database.name}`
          : `/project/${id}/database/collections?docSchema=${database.name}`
      }
      minHeight={12}
      className="group/schema-card"
    >
      <Row gap="2" vertical="center" horizontal="space-between" fillWidth>
        <Text as={"h3"} variant="heading-strong-s">
          {database.name}
        </Text>
        <Tag variant="neutral">{database.type}</Tag>
      </Row>

      {/* <div className="flex items-center justify-between w-full mt-4">
        <div onClick={(e) => e.preventDefault()} className="inline w-min">
          <IDChip id={database.name} hideIcon />
        </div>
        <DropdownWrapper
          trigger={
            <IconButton
              icon={MoreVertical}
              onClick={(e: any) => e.preventDefault()}
              variant="ghost"
              size="s"
              aria-label="Actions"
              data-testid="more-button"
              className="hover:!bg-(--neutral-alpha-medium) dark:hover:!bg-(--neutral-alpha-medium) *:opacity-100 opacity-0 group-hover/schema-card:!opacity-100 transition-opacity"
            />
          }
          dropdown={
            <>
              <Option
                hasPrefix={<Icon name="trash" size="s" />}
                value="0"
                onClick={(e) => handleDelete(database)}
                onBackground="danger-weak"
              >
                Delete
              </Option>
            </>
          }
        />
      </div> */}
    </GridCard>
  );
};
