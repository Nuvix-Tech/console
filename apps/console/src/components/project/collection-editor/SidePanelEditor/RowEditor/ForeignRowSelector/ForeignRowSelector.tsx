import { Loader2 } from "lucide-react";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  filtersToUrlParams,
  formatFilterURLParams,
  formatSortURLParams,
  sortsToUrlParams,
} from "../../../grid/grid.utils";
import { SortPopover } from "../../../grid/components/header/sort";
import type { Filter } from "../../../grid/types";
import { Sort } from "../../../grid/types";
// import {
//   RoleImpersonationState,
//   useRoleImpersonationStateSnapshot,
// } from "state/role-impersonation-state";
import ActionBar from "../../ActionBar";
import Pagination from "./Pagination";
import SelectorGrid from "./SelectorGrid";
import { useProjectStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { SidePanel } from "@/ui/SidePanel";
import { Button } from "@nuvix/ui/components";
import { TableParam } from "@/types";
import { Code } from "@chakra-ui/react";
import { Models } from "@nuvix/console";
import { useCollectionDocumentsQuery, useCollectionEditorQuery } from "@/data/collections";
import id from "@/components/others/id";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { CollectionEditorCollectionStateContextProvider } from "@/lib/store/collection";
import RefreshButton from "../../../grid/components/header/RefreshButton";
import FilterPopover from "../../../grid/components/header/filter/FilterPopover";

export interface ForeignRowSelectorProps {
  visible: boolean;
  attribute?: Models.AttributeRelationship;
  onSelect: (value?: { [key: string]: any }) => void;
  closePanel: () => void;
}

const ForeignRowSelector = ({
  visible,
  attribute,
  onSelect,
  closePanel,
}: ForeignRowSelectorProps) => {
  const { project, sdk } = useProjectStore();
  const { relatedCollection, key } = attribute ?? {};
  const { selectedSchema } = useQuerySchemaState("doc");

  const { data: collection } = useCollectionEditorQuery({
    projectRef: project?.$id,
    sdk,
    id: relatedCollection!,
    schema: selectedSchema,
  });

  const [{ sort: sorts, filter: filters }, setParams] = useState<{
    filter: string[];
    sort: string[];
  }>({ filter: [], sort: [] });

  const onApplyFilters = (appliedFilters: Filter[]) => {
    // Reset page to 1 when filters change
    if (page > 1) {
      setPage(1);
    }

    setParams((prevParams) => {
      return {
        ...prevParams,
        filter: filtersToUrlParams(appliedFilters),
      };
    });
  };

  const onApplySorts = (appliedSorts: Sort[]) => {
    setParams((prevParams) => {
      return {
        ...prevParams,
        sort: sortsToUrlParams(appliedSorts),
      };
    });
  };

  const rowsPerPage = 100;
  const [page, setPage] = useState(1);

  const { data, isLoading, isSuccess, isError, isRefetching } = useCollectionDocumentsQuery(
    {
      projectRef: project?.$id,
      sdk,
      collection: collection ?? ({ $id: "" } as any),
      sorts: formatSortURLParams(collection?.name || "", sorts),
      filters: formatFilterURLParams(filters),
      populate: [],
      page,
      schema: selectedSchema,
      limit: rowsPerPage,
    },
    {
      enabled: !!(visible && project?.$id && sdk && collection),
    },
    // {
    //   keepPreviousData: true,
    // },
  );

  return (
    <SidePanel
      visible={visible}
      size="large"
      header={
        <div>
          Select a record to reference from{" "}
          <Code className="font-mono text-sm">
            {selectedSchema}.{collection?.name}
          </Code>
        </div>
      }
      onCancel={closePanel}
      customFooter={<ActionBar hideApply backButtonLabel="Cancel" closePanel={closePanel} />}
    >
      <SidePanel.Content className="h-full !px-0">
        <div className="h-full">
          {isLoading && (
            <div className="flex h-full py-6 flex-col items-center justify-center space-y-2">
              <Loader2 size={14} className="animate-spin" />
              <p className="text-sm text-foreground-light">Loading rows</p>
            </div>
          )}

          {isError && (
            <div className="flex h-full py-6 flex-col items-center justify-center">
              <p className="text-sm text-foreground-light">
                Unable to load rows from{" "}
                <Code>
                  {selectedSchema}.{collection?.name}
                </Code>
                . Please try again or contact support.
              </p>
            </div>
          )}

          {project?.$id && collection && isSuccess && (
            <CollectionEditorCollectionStateContextProvider
              projectRef={project.$id}
              collection={collection!}
              editable={false}
            >
              <div className="h-full flex flex-col bg-muted">
                <div className="flex items-center justify-between my-2 mx-3">
                  <div className="flex items-center gap-4">
                    <RefreshButton
                      schema={selectedSchema}
                      collectionId={collection?.$id}
                      isRefetching={isRefetching}
                    />
                    <FilterPopover
                      portal={false}
                      filters={filters}
                      onApplyFilters={onApplyFilters}
                    />
                    <DndProvider backend={HTML5Backend} context={window}>
                      <SortPopover portal={false} sorts={sorts} onApplySorts={onApplySorts} />
                    </DndProvider>
                  </div>

                  <div className="flex items-center gap-x-3 divide-x">
                    <Pagination
                      page={page}
                      setPage={setPage}
                      rowsPerPage={rowsPerPage}
                      currentPageRowsCount={data?.documents.length ?? 0}
                      isLoading={isRefetching}
                    />
                    {/* {isNullable && (
                      <div className="pl-3">
                        <Button
                          type="default"
                          variant="secondary"
                          size="s"
                          onClick={() => {
                            if (columns?.length === 1) onSelect({ [columns[0].source]: null });
                          }}
                        >
                          Set NULL
                        </Button>
                      </div>
                    )} */}
                  </div>
                </div>

                {data.documents.length > 0 ? (
                  <SelectorGrid
                    rows={data.documents}
                    onRowSelect={(row) => {
                      // const value = columns?.reduce((a: any, b: any) => {
                      //   const targetColumn = selectedTable?.columns.find(
                      //     (x) => x.name === b.target,
                      //   );
                      //   const value =
                      //     // targetColumn?.format === "bytea"
                      //     //   ? convertByteaToHex(row[b.target])
                      //     //   :
                      //     row[b.target];
                      //   return { ...a, [b.source]: value };
                      // }, {});
                      // onSelect(value);
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center border-b border-t border-default">
                    <span className="text-foreground-light text-sm">No Rows Found</span>
                  </div>
                )}
              </div>
            </CollectionEditorCollectionStateContextProvider>
          )}
        </div>
      </SidePanel.Content>
    </SidePanel>
  );
};

export default ForeignRowSelector;
