import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useCallback } from "react";

import {
  formatFilterURLParams,
  formatSortURLParams,
  loadTableEditorStateFromLocalStorage,
  parseSupaTable,
} from "@/components/grid/NuvixGrid.utils";
import { Filter, Sort } from "@/components/grid/types";
import { prefetchTableEditor } from "@/data/table-editor/table-editor-query";
import { prefetchTableRows } from "@/data/table-rows/table-rows-query";
// import { RoleImpersonationState } from 'lib/role-impersonation'
// import { useRoleImpersonationStateSnapshot } from 'state/role-impersonation-state'
import PrefetchableLink, { PrefetchableLinkProps } from "./PrefetchableLink";
import { ProjectSdk } from "@/lib/sdk";
import { TABLE_EDITOR_DEFAULT_ROWS_PER_PAGE } from "@/lib/store/table-editor";
import { useProjectStore } from "@/lib/store";

interface PrefetchEditorTablePageArgs {
  queryClient: QueryClient;
  projectRef: string;
  sdk: ProjectSdk;
  id: number;
  sorts?: Sort[];
  filters?: Filter[];
  roleImpersonationState?: any; //RoleImpersonationState
}

export function prefetchEditorTablePage({
  queryClient,
  projectRef,
  sdk,
  id,
  sorts,
  filters,
  roleImpersonationState,
}: PrefetchEditorTablePageArgs) {
  return prefetchTableEditor(queryClient, {
    projectRef,
    sdk,
    id,
  }).then((entity) => {
    if (entity) {
      const supaTable = parseSupaTable(entity);

      const { sorts: localSorts = [], filters: localFilters = [] } =
        loadTableEditorStateFromLocalStorage(projectRef, entity.name, entity.schema) ?? {};

      prefetchTableRows(queryClient, {
        projectRef,
        sdk,
        tableId: id,
        sorts: sorts ?? formatSortURLParams(supaTable.name, localSorts),
        filters: filters ?? formatFilterURLParams(localFilters),
        page: 1,
        limit: TABLE_EDITOR_DEFAULT_ROWS_PER_PAGE,
        roleImpersonationState,
      });
    }
  });
}

export function usePrefetchEditorTablePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { project, sdk } = useProjectStore();
  // const roleImpersonationState = useRoleImpersonationStateSnapshot()

  return useCallback(
    ({ id: _id, filters, sorts }: { id?: string; filters?: Filter[]; sorts?: Sort[] }) => {
      const id = _id ? Number(_id) : undefined;
      if (!project || !id || isNaN(id)) return;

      // Prefetch the code
      router.prefetch(`/project/${project.$id}/editor/${id}`);

      // Prefetch the data
      prefetchEditorTablePage({
        queryClient,
        projectRef: project.$id,
        sdk,
        id,
        sorts,
        filters,
        // roleImpersonationState: roleImpersonationState as RoleImpersonationState,
      }).catch(() => {
        // eat prefetching errors as they are not critical
      });
    },
    [project, queryClient, router], //roleImpersonationState
  );
}

interface EditorTablePageLinkProps extends Omit<PrefetchableLinkProps, "href" | "prefetcher"> {
  projectRef?: string;
  id?: string;
  sorts?: Sort[];
  filters?: Filter[];
  href?: PrefetchableLinkProps["href"];
}

export function EditorTablePageLink({
  projectRef,
  id,
  sorts,
  filters,
  href,
  children,
  ...props
}: PropsWithChildren<EditorTablePageLinkProps>) {
  const prefetch = usePrefetchEditorTablePage();

  return (
    <PrefetchableLink
      href={href || `/project/${projectRef}/editor/${id}`}
      prefetcher={() => prefetch({ id, sorts, filters })}
      {...props}
    >
      {children}
    </PrefetchableLink>
  );
}
