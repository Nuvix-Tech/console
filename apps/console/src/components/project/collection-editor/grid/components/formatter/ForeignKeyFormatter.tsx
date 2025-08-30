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
import { values } from "lodash";

interface Props extends PropsWithChildren<RenderCellProps<Models.Document, unknown>> {
  collectionId: string;
  schema: string;
}

export const ForeignKeyFormatter = (props: Props) => {
  const { project, sdk } = useProjectStore();

  const { collectionId, schema, row, column } = props;

  const { data } = useCollectionEditorQuery({
    projectRef: project?.$id,
    sdk,
    id: collectionId,
    schema: schema,
  });

  const targetCollection = data;
  const value = row[column.key];

  const relationship = data?.attributes.find((a: any) => {
    return a.type === "relationship" && a.twoWayKey === column.key;
  });

  return (
    <div className="nx-grid-foreign-key-formatter flex justify-between">
      <span className="nx-grid-foreign-key-formatter__text">
        {value === null ? (
          <NullValue />
        ) : Array.isArray(value) ? (
          values.length > 0 ? (
            value.join(", ")
          ) : (
            "[]"
          )
        ) : (
          value
        )}
      </span>
      {relationship !== undefined &&
        targetCollection !== undefined &&
        (value !== null || (Array.isArray(value) && value.length > 0)) && (
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
              <ReferenceRecordPeek
                collection={targetCollection}
                column={relationship as unknown as Models.AttributeRelationship}
                value={value}
              />
            </PopoverContent>
          </Popover>
        )}
    </div>
  );
};
