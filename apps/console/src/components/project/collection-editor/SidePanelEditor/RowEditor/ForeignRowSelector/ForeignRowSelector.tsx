import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import ActionBar from "@/components/editor/SidePanelEditor/ActionBar";
import Pagination from "./Pagination";
import SelectorGrid from "./SelectorGrid";
import { useProjectStore } from "@/lib/store";
import { SidePanel } from "@/ui/SidePanel";
import { Button } from "@nuvix/ui/components";
import { Code } from "@chakra-ui/react";
import { Models, RelationshipType } from "@nuvix/console";
import { useCollectionDocumentsQuery, useCollectionEditorQuery } from "@/data/collections";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import {
  CollectionEditorCollectionStateContextProvider,
  useCollectionEditorCollectionStateSnapshot,
} from "@/lib/store/collection";
import RefreshButton from "../../../grid/components/header/RefreshButton";
import FilterPopover from "../../../grid/components/header/filter/FilterPopover";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";

export interface ForeignRowSelectorProps {
  visible: boolean;
  attribute?: Models.AttributeRelationship;
  onSelect: (diff: { deleted: string[]; addedValues: string[] } | null | string) => void;
  relationship?: {
    attribute: Models.AttributeRelationship;
    row: any;
  };
  closePanel: () => void;
}

export function isSelectMany(attribute: Models.AttributeRelationship) {
  const type = attribute.relationType;
  const side = attribute.side;

  if (type === RelationshipType.ManyToMany) return true;
  else if (
    (type === RelationshipType.ManyToOne && side === "child") ||
    (type === RelationshipType.OneToMany && side === "parent")
  ) {
    return true;
  }

  return false;
}

const ForeignRowSelector = ({
  visible,
  attribute,
  onSelect,
  closePanel,
  relationship,
}: ForeignRowSelectorProps) => {
  const { project, sdk } = useProjectStore();
  const { relatedCollection, key } = attribute ?? {};
  const { selectedSchema } = useQuerySchemaState("doc");
  const isMany = attribute && isSelectMany(attribute);

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
  );

  return (
    <SidePanel
      visible={visible}
      size="large"
      header={
        <div>
          Select {isMany ? "documents" : "a document"} to reference from{" "}
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
              <p className="text-sm neutral-on-background-medium">Loading rows</p>
            </div>
          )}

          {isError && (
            <div className="flex h-full py-6 flex-col items-center justify-center">
              <p className="text-sm neutral-on-background-medium">
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

                  <div className="flex items-center divide-x">
                    <Pagination
                      page={page}
                      setPage={setPage}
                      rowsPerPage={rowsPerPage}
                      currentPageRowsCount={data?.documents.length || 0}
                      isLoading={isRefetching}
                    />
                    {attribute && !isSelectMany(attribute) ? (
                      <div className="pl-2">
                        <Button
                          type="default"
                          variant="secondary"
                          size="s"
                          onClick={() => {
                            onSelect(null);
                          }}
                        >
                          Set NULL
                        </Button>
                      </div>
                    ) : (
                      <div className="pl-3">
                        <UpdateButton
                          onSelect={onSelect}
                          relationship={relationship}
                          documents={data.documents}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {data.documents.length > 0 ? (
                  <SelectorGrid
                    rows={data.documents}
                    onRowSelect={(row) => {
                      if (isSelectMany(attribute!)) return;
                      onSelect(row.$id);
                    }}
                    multiSelect={attribute ? isSelectMany(attribute) : false}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center border-b border-t border-default">
                    <span className="neutral-on-background-medium text-sm">No Rows Found</span>
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

const UpdateButton = ({
  onSelect,
  relationship,
  documents,
}: {
  onSelect: (diff: { deleted: string[]; addedValues: string[] }) => void;
  relationship?: {
    attribute: Models.AttributeRelationship;
    row: any;
  };
  documents: Models.Document[];
}) => {
  const snap = useCollectionEditorCollectionStateSnapshot();
  const editor = useCollectionEditorStore();
  relationship =
    (editor.sidePanel?.type === "foreign-row-selector"
      ? editor.sidePanel?.relationship
      : relationship) || relationship;

  const attribute = relationship?.attribute;
  const isMany = attribute && isSelectMany(attribute);

  useEffect(() => {
    if (relationship && isMany) {
      const values = relationship.row[attribute.key];
      if (Array.isArray(values)) {
        const ids = values.filter((v) => v?.$id).map((v) => v.$id);
        snap.setSelectedRows(new Set(ids));
      }
    }
  }, [relationship, attribute?.key, relationship?.row]);

  const diff = useMemo(() => {
    if (!relationship || !isMany) return { deleted: [], addedValues: [] };

    const values = relationship.row[attribute.key];
    const existingIds = Array.isArray(values) ? values.filter((v) => v?.$id).map((v) => v.$id) : [];
    const selectedIds = Array.from(snap.selectedRows);
    const documentsIds = documents.map((d) => d.$id);

    const addedValues = selectedIds.filter((id) => !existingIds.includes(id));
    const deleted = existingIds.filter(
      (id) => !selectedIds.includes(id) && documentsIds.includes(id),
    );

    return { deleted, addedValues };
  }, [relationship, attribute?.key, isMany, snap.selectedRows, documents]);

  const hasChanges = diff.deleted.length > 0 || diff.addedValues.length > 0;

  return (
    <Button
      type="default"
      variant="secondary"
      size="s"
      disabled={!hasChanges}
      onClick={() => onSelect(diff)}
    >
      Update
    </Button>
  );
};

export default ForeignRowSelector;
