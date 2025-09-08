import { Clipboard, Copy, Edit, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { IS_PLATFORM } from "@/lib/constants";
import type { ItemRenderer } from "@/ui/InfiniteList";
import { copyToClipboard } from "@/lib/helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  // DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import { useProjectStore } from "@/lib/store";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { cn } from "@nuvix/sui/lib/utils";
import { Models } from "@nuvix/console";
import { useCollectionEditorStateSnapshot } from "@/lib/store/collection-editor";
import { Icon, SmartLink, Text } from "@nuvix/ui/components";
import { TreeViewItemVariant } from "../../table-editor/components/EntityListItem";

export interface EntityListItemProps {
  id: string;
  projectRef: string;
  isLocked: boolean;
  isActive?: boolean;
  schema: string;
  href?: string;
}

export const CollectionListItem: ItemRenderer<Models.Collection, EntityListItemProps> = ({
  id,
  projectRef,
  item: collection,
  isLocked,
  isActive: _isActive,
  href,
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

  const url = href
    ? `/project/${projectRef}${href}/${collection.$id}?docSchema=${selectedSchema}`
    : `/project/${projectRef}/collections/${collection.$id}?docSchema=${selectedSchema}`;

  return (
    <SmartLink
      title={collection.name}
      id={collection.$id}
      href={url}
      role="button"
      aria-label={`View ${collection.name}`}
      fillWidth
      className={cn(
        TreeViewItemVariant({
          isSelected: isActive && !isPreview,
          isOpened: isOpened && !isPreview,
          isPreview,
        }),
        "!px-3 flex items-center justify-between !mx-0",
      )}
      // onDoubleClick={(e) => {
      //   e.preventDefault()
      //   const tabId = createTabId(entity.type, { id: entity.id })
      //   makeTabPermanent(projectRef, tabId)
      // }}
    >
      <>
        {isActive && <div className="absolute left-0 h-full w-0.5 neutral-solid-strong" />}
        <div
          className={cn(
            "truncate",
            "overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-2 relative w-full",
            isActive
              ? "text-foreground"
              : "neutral-on-background-medium group-hover:text-foreground",
          )}
        >
          <Icon name="table" size="s" />
          <span
            className={cn(
              isActive
                ? "text-foreground"
                : "neutral-on-background-medium group-hover:text-foreground",
              "text-sm",
              "transition",
              "truncate",
            )}
          >
            {collection.name}
          </span>
        </div>

        {canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger className="neutral-on-background-weak transition-all text-transparent group-hover:!text-foreground data-[state=open]:!text-foreground flex items-center justify-center">
              <Icon name={MoreHorizontal} size="s" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-48">
              <DropdownMenuItem
                key="copy-name"
                className="space-x-2"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(collection.$id);
                }}
              >
                <Icon name={Clipboard} size="s" />
                <span>Copy ID</span>
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
                <Icon name={Edit} size="s" />
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
                <Icon name={Copy} size="s" />
                <span>Duplicate collection</span>
              </DropdownMenuItem>

              {/* <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-x-2 space-x-2">
                  <Icon name={Download} size="s" />
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
              </DropdownMenuSub> */}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                key="delete-collection"
                className="space-x-2"
                onClick={(e) => {
                  e.stopPropagation();
                  snap.onDeleteCollection();
                }}
              >
                <Icon name={"trash"} size="s" onBackground="danger-weak" />
                <Text onBackground="danger-weak">Delete collection</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </>
    </SmartLink>
  );
};
