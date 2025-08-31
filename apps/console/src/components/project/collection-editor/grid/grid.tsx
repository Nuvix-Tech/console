import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { DataGridHandle } from "react-data-grid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createPortal } from "react-dom";

import { useParams } from "next/navigation";
import {
  filtersToUrlParams,
  formatFilterURLParams,
  formatSortURLParams,
  saveCollectionEditorStateToLocalStorage,
} from "./grid.utils";
import { Shortcuts } from "./components/common/Shortcuts";
import Footer from "./components/footer/Footer";
import { Grid } from "./components/grid/Grid";
import Header, { HeaderProps } from "./components/header/Header";
import { RowContextMenu } from "./components/menu";
import { Filter, GridProps } from "./types";
import { useProjectStore } from "@/lib/store";
import { useTableEditorFiltersSort } from "@/hooks/useTableEditorFilterSort";
import { Column } from "@nuvix/ui/components";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { useCollectionDocumentsQuery } from "@/data/collections/documents/documents_query";

const EMPTY_ARR: any[] = [];

export const CollectionGrid = ({
  customHeader,
  gridProps,
  children,
}: Pick<HeaderProps, "customHeader"> &
  PropsWithChildren<{
    gridProps?: GridProps;
  }>) => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const { project, sdk } = useProjectStore();

  const state = useCollectionEditorStore();
  const snap = useCollectionEditorCollectionStateSnapshot();

  const gridRef = useRef<DataGridHandle>(null);
  const [mounted, setMounted] = useState(false);

  const { filters: filter, sorts: sort, setParams } = useTableEditorFiltersSort();

  const sorts = formatSortURLParams(snap.collection.name, sort as string[] | undefined);
  const filters = formatFilterURLParams(filter as string[]);

  const onApplyFilters = useCallback(
    (appliedFilters: Filter[]) => {
      // Reset page to 1 when filters change
      snap.setPage(1);

      const filters = filtersToUrlParams(appliedFilters);

      setParams((prevParams) => {
        return {
          ...prevParams,
          filter: filters,
        };
      });

      if (project?.$id) {
        saveCollectionEditorStateToLocalStorage({
          projectRef: project.$id,
          collectionName: snap.collection.name,
          schema: snap.collection.$schema,
          filters: filters,
        });
      }
    },
    [project?.$id, snap.collection.name, snap.collection.$schema],
  );

  const { data, error, isSuccess, isError, isLoading, isRefetching } = useCollectionDocumentsQuery(
    {
      projectRef: project?.$id,
      sdk,
      collection: snap.collection,
      schema: snap.collection.$schema,
      sorts,
      filters,
      page: snap.page,
      limit: state.rowsPerPage,
    },
    {
      // keepPreviousData: true,
      retryDelay: (retryAttempt, error: any) => {
        if (error && error.message?.includes("does not exist")) {
          setParams((prevParams) => {
            return {
              ...prevParams,
              ...{ sort: undefined },
            };
          });
        }
        if (retryAttempt > 3) {
          return Infinity;
        }
        return 5000;
      },
    },
  );

  useEffect(() => {
    if (!mounted) setMounted(true);
  }, []);

  const rows = data?.documents ?? EMPTY_ARR;
  snap.setCountDocuments(data?.total ?? 0);

  return (
    <DndProvider backend={HTML5Backend} context={window}>
      <Column fill radius="l" overflow="hidden" className="grid-collection-editor">
        <Header sorts={sorts} filters={filters} customHeader={customHeader} />

        {children || (
          <>
            <Grid
              ref={gridRef}
              {...gridProps}
              rows={rows}
              error={error}
              isLoading={isLoading}
              isSuccess={isSuccess}
              isError={isError}
              filters={filters}
              onApplyFilters={onApplyFilters}
            />
            <Footer isRefetching={isRefetching} />
            <Shortcuts gridRef={gridRef as any} rows={rows} />
          </>
        )}

        {mounted && createPortal(<RowContextMenu rows={rows} />, document.body)}
      </Column>
    </DndProvider>
  );
};
