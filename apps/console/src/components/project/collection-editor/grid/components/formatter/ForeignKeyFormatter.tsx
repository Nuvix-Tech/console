import { ArrowRight } from "lucide-react";
import type { PropsWithChildren } from "react";
import type { RenderCellProps } from "react-data-grid";

import { ReferenceRecordPeek } from "./ReferenceRecordPeek";
import { useProjectStore } from "@/lib/store";
import { Popover, PopoverContent, PopoverTrigger } from "@nuvix/sui/components/popover";
import { IconButton } from "@nuvix/ui/components";
import type { Models } from "@nuvix/console";
import { NullValue } from "@/components/grid/components/common/NullValue";
import { useCollectionEditorQuery } from "@/data/collections";

interface Props extends PropsWithChildren<RenderCellProps<Models.Document, unknown>> {
  collectionId: string;
  attribute: Models.AttributeRelationship;
  schema: string;
}

export const ForeignKeyFormatter = (props: Props) => {
  const { project, sdk } = useProjectStore();

  const { schema, attribute, row, column } = props;

  const { data } = useCollectionEditorQuery({
    projectRef: project?.$id,
    sdk,
    id: attribute.relatedCollection,
    schema: schema,
  });

  const targetCollection = data;
  const value = row[column.key];

  const getDisplayText = (val: any) => {
    if (val === null) return <NullValue />;
    if (Array.isArray(val)) {
      return val.length > 0 ? val.map((v) => v?.$id).join(", ") : "[]";
    }
    return val?.$id;
  };

  const shouldShowPopover =
    attribute && targetCollection && (Array.isArray(value) ? value.length > 0 : value !== null);

  return (
    <div className="nx-grid-foreign-key-formatter flex justify-between">
      <span className="nx-grid-foreign-key-formatter__text truncate" title={getDisplayText(value)}>
        {getDisplayText(value)}
      </span>
      {shouldShowPopover && (
        <Popover>
          <PopoverTrigger asChild>
            <IconButton
              type="button"
              size="s"
              variant="secondary"
              icon={<ArrowRight size={14} />}
              onClick={(e: any) => e.stopPropagation()}
              tooltip={"View referencing record(s)"}
            />
          </PopoverTrigger>
          <PopoverContent align="end" className="p-0 w-96">
            {/* portal */}
            <ReferenceRecordPeek collection={targetCollection} column={attribute} value={value} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
