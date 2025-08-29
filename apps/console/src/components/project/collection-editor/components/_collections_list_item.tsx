import { Clipboard, Copy, Download, Edit, Lock, MoreHorizontal, Trash, Unlock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { IS_PLATFORM } from "@/lib/constants";
import type { ItemRenderer } from "@/ui/InfiniteList";
import { ENTITY_TYPE } from "@/data/entity-types/entity-type-constants";
import { copyToClipboard } from "@/lib/helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { useProjectStore } from "@/lib/store";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { cn } from "@nuvix/sui/lib/utils";
import { Models } from "@nuvix/console";
import { useCollectionEditorStateSnapshot } from "@/lib/store/collection-editor";
import { Icon, SmartLink } from "@nuvix/ui/components";
import { TreeViewItemVariant } from "../../table-editor/components/EntityListItem";

export interface EntityListItemProps {
  id: string;
  projectRef: string;
  isLocked: boolean;
  isActive?: boolean;
  schema: string;
}

export const CollectionListItem: ItemRenderer<Models.Collection, EntityListItemProps> = ({
  id,
  projectRef,
  item: collection,
  isLocked,
  isActive: _isActive,
  schema,
}) => {
  const { project, sdk } = useProjectStore();
  const snap = useCollectionEditorStateSnapshot();
  const { selectedSchema } = useQuerySchemaState("doc");

  // For tabs preview flag logic
  // const isTableEditorTabsEnabled = useIsTableEditorTabsEnabled()
  // const tabId = createTabId(entity.type, { id: entity.id })
  // const tabStore = getTabsStore(projectRef)
  const isPreview = false; // isTableEditorTabsEnabled ? tabStore.previewTabId === tabId : false

  // const tabs = useSnapshot(tabStore)
  const isOpened = true; // Object.values(tabs.tabsMap).some((tab) => tab.metadata?.tableId === entity.id)
  const isActive = id === collection.$id;
  const canEdit = isActive && !isLocked;

  // const { data: lints = [] } = useProjectLintsQuery({
  //   projectRef: project?.$id,
  // })

  const tableHasLints: boolean = false;
  // getEntityLintDetails(
  //   entity.name,
  //   'rls_disabled_in_public',
  //   ['ERROR'],
  //   lints,
  //   selectedSchema
  // ).hasLint

  const formatTooltipText = (entityType: string) => {
    return Object.entries(ENTITY_TYPE)
      .find(([, value]) => value === entityType)?.[0]
      ?.toLowerCase()
      ?.split("_")
      ?.join(" ");
  };

  const exportTableAsCSV = async () => {
    if (IS_PLATFORM && !sdk) {
      return console.error("SDK is required");
    }
    const toastId = toast.loading(`Exporting ${collection.name} as CSV...`);

    try {
      //     const table = await getTableEditor({
      //         id: entity.id,
      //         projectRef,
      //         sdk,
      //     });
      //     if (isTableLike(table) && table.live_rows_estimate > MAX_EXPORT_ROW_COUNT) {
      //         return toast.error(
      //             <div className="text-foreground prose text-sm">{MAX_EXPORT_ROW_COUNT_MESSAGE}</div>,
      //             { id: toastId },
      //         );
      //     }
      //     const nuvixTable = table && parseNuvixTable(table);
      //     if (!nuvixTable) {
      //         return toast.error(`Failed to export table: ${entity.name}`, { id: toastId });
      //     }
      //     const rows = await fetchAllTableRows({
      //         projectRef,
      //         sdk,
      //         table: nuvixTable,
      //     });
      //     const formattedRows = rows.map((row) => {
      //         const formattedRow = row;
      //         Object.keys(row).map((column) => {
      //             if (typeof row[column] === "object" && row[column] !== null)
      //                 formattedRow[column] = JSON.stringify(formattedRow[column]);
      //         });
      //         return formattedRow;
      //     });
      //     if (formattedRows.length > 0) {
      //         const csv = Papa.unparse(formattedRows, {
      //             columns: nuvixTable.columns.map((column) => column.name),
      //         });
      //         const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      //         saveAs(csvData, `${entity!.name}_rows.csv`);
      //     }
      //     toast.success(`Successfully exported ${entity.name} as CSV`, { id: toastId });
    } catch (error: any) {
      //     toast.error(`Failed to export table: ${error.message}`, { id: toastId });
    }
  };

  return (
    <SmartLink
      title={collection.name}
      id={collection.$id}
      href={`/project/${projectRef}/collections/${collection.$id}?schema=${schema}`}
      role="button"
      aria-label={`View ${collection.name}`}
      fillWidth
      className={cn(
        TreeViewItemVariant({
          isSelected: isActive && !isPreview,
          isOpened: isOpened && !isPreview,
          isPreview,
        }),
        "!px-4 flex items-center justify-between !mx-0",
        {
          "bg-[var(--neutral-alpha-weak)] border-x border-accent": isActive && !isPreview,
        },
      )}
      // onDoubleClick={(e) => {
      //   e.preventDefault()
      //   const tabId = createTabId(entity.type, { id: entity.id })
      //   makeTabPermanent(projectRef, tabId)
      // }}
    >
      <>
        {/* {isActive && <div className="absolute left-0 h-full w-0.5 bg-foreground" />} */}
        <div
          className={cn(
            "truncate",
            "overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-2 relative w-full",
            isActive && "text-foreground",
          )}
        >
          <Icon name="refresh" size="xs" />
          <span
            className={cn(
              isActive ? "text-foreground" : "text-foreground-light group-hover:text-foreground",
              "text-sm",
              "transition",
              "truncate",
            )}
          >
            {collection.name}
          </span>
          <EntityTooltipTrigger
            collection={collection}
            isActive={isActive}
            tableHasLints={tableHasLints}
          />
        </div>

        {canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger className="text-foreground-lighter transition-all text-transparent group-hover:text-foreground data-[state=open]:text-foreground">
              <MoreHorizontal size={14} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-44">
              <DropdownMenuItem
                key="copy-name"
                className="space-x-2"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(collection.name);
                }}
              >
                <Clipboard size={12} />
                <span>Copy name</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                key="edit-collection"
                className="space-x-2"
                onClick={(e) => {
                  e.stopPropagation();
                  snap.onEditCollection();
                }}
              >
                <Edit size={12} />
                <span>Edit collection</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                key="duplicate-collection"
                className="space-x-2"
                onClick={(e) => {
                  e.stopPropagation();
                  snap.onDuplicateCollection();
                }}
              >
                <Copy size={12} />
                <span>Duplicate collection</span>
              </DropdownMenuItem>
              <DropdownMenuItem key="view-policies" className="space-x-2" asChild>
                <Link
                  key="view-policies"
                  href={`/project/${projectRef}/auth/policies?schema=${selectedSchema}&search=${collection.$id}`}
                >
                  <Lock size={12} />
                  <span>View policies</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-x-2 space-x-2">
                  <Download size={12} />
                  Export data
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    key="download-table-csv"
                    className="space-x-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportTableAsCSV();
                    }}
                  >
                    <span>Export collection as CSV</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                key="delete-collection"
                className="gap-x-2"
                onClick={(e) => {
                  e.stopPropagation();
                  snap.onDeleteCollection();
                }}
              >
                <Trash size={12} />
                <span>Delete collection</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </>
    </SmartLink>
  );
};

const EntityTooltipTrigger = ({
  collection,
  isActive,
  tableHasLints,
}: {
  collection: Models.Collection;
  isActive: boolean;
  tableHasLints: boolean;
}) => {
  let tooltipContent = "";

  if (tooltipContent) {
    return (
      <Tooltip disableHoverableContent={true}>
        <TooltipTrigger className="min-w-4">
          <Unlock
            size={14}
            strokeWidth={2}
            className={cn("min-w-4", isActive ? "text-warning-600" : "text-warning-500")}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <span>{tooltipContent}</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return null;
};
