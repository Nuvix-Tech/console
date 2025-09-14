// import { PermissionAction } from '@supabase/shared-types/out/constants';
import { Cone, Lock, MousePointer2, PlusCircle, Unlock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

// import { useParams } from 'common';
// import { RefreshButton } from 'components/grid/components/header/RefreshButton';
// import { getEntityLintDetails } from 'components/interfaces/TableGridEditor/TableEntity.utils';
// import { APIDocsButton } from 'components/ui/APIDocsButton';
// import { ButtonTooltip } from 'components/ui/ButtonTooltip';
import { useDatabasePoliciesQuery } from "@/data/database-policies/database-policies-query";
import { useDatabasePublicationsQuery } from "@/data/database-publications/database-publications-query";
import { useDatabasePublicationUpdateMutation } from "@/data/database-publications/database-publications-update-mutation";
// import { useProjectLintsQuery } from '@/data/lint/lint-query';
import {
  Entity,
  isTableLike,
  isForeignTable as isTableLikeForeignTable,
  isMaterializedView as isTableLikeMaterializedView,
  isView as isTableLikeView,
} from "@/data/table-editor/table-editor-types";
import { useTableUpdateMutation } from "@/data/tables/table-update-mutation";
// import { useSendEventMutation } from '@/data/telemetry/send-event-mutation';
// import { useAsyncCheckProjectPermissions } from '@/hooks/useCheckPermissions';
// import { useIsFeatureEnabled } from '@/hooks/useIsFeatureEnabled';
// import { useSelectedOrganizationQuery } from '@/hooks/useSelectedOrganization';
// import { useSelectedProjectQuery } from '@/hooks/useSelectedProject';
// import { useIsProtectedSchema } from '@/hooks/useProtectedSchemas';
import { parseAsBoolean, useQueryState } from "nuqs";
import { PopoverContent, PopoverTrigger, Popover } from "@nuvix/sui/components/popover";
import { Button } from "@nuvix/ui/components/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { cn } from "@nuvix/sui/lib/utils";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/lib/store";
import { useTableEditorTableStateSnapshot } from "@/lib/store/table";
import RefreshButton from "../grid/components/header/RefreshButton";
import ConfirmationModal from "./components/_confim_dialog";
import { useConfirm } from "@nuvix/ui/components";
// import ConfirmModal from 'ui-patterns/Dialogs/ConfirmDialog';
// import ConfirmationModal from 'ui-patterns/Dialogs/ConfirmationModal';
// import { RoleImpersonationPopover } from '../RoleImpersonationSelector';
// import ViewEntityAutofixSecurityModal from './ViewEntityAutofixSecurityModal';

export interface GridHeaderActionsProps {
  table: Entity;
  isRefetching: boolean;
}

export const GridHeaderActions = ({ table, isRefetching }: GridHeaderActionsProps) => {
  const { id: ref } = useParams();
  const { project, sdk } = useProjectStore((s) => s);
  // const { data: org } = useSelectedOrganizationQuery();

  const [showWarning, setShowWarning] = useQueryState(
    "showWarning",
    parseAsBoolean.withDefault(false),
  );

  // need project lints to get security status for views
  // const { data: lints = [] } = useProjectLintsQuery({ projectRef: project?.ref });
  const lints: any[] = [];

  const isTable = isTableLike(table);
  const isForeignTable = isTableLikeForeignTable(table);
  const isView = isTableLikeView(table);
  const isMaterializedView = isTableLikeMaterializedView(table);

  const { realtimeAll: realtimeEnabled } = { realtimeAll: false }; // useIsFeatureEnabled(['realtime:all']);
  const { isSchemaLocked } = { isSchemaLocked: false }; // useIsProtectedSchema({ schema: table.schema });

  const { mutate: updateTable } = useTableUpdateMutation({
    onError: (error) => {
      toast.error(`Failed to toggle RLS: ${error.message}`);
    },
  });

  const [showEnableRealtime, setShowEnableRealtime] = useState(false);
  const confirm = useConfirm();
  const [isAutofixViewSecurityModalOpen, setIsAutofixViewSecurityModalOpen] = useState(false);

  const snap = useTableEditorTableStateSnapshot();
  const showHeaderActions = snap.selectedRows.size === 0;

  const projectRef = project?.$id;
  const { data } = useDatabasePoliciesQuery({
    projectRef,
    sdk,
  });
  const policies = (data ?? []).filter(
    (policy: any) => policy.schema === table.schema && policy.table === table.name,
  );

  const { data: publications } = useDatabasePublicationsQuery({
    projectRef,
    sdk,
  });
  const realtimePublication = (publications ?? []).find(
    (publication: any) => publication.name === "supabase_realtime",
  );
  const realtimeEnabledTables = realtimePublication?.tables ?? [];
  const isRealtimeEnabled = realtimeEnabledTables.some((t: any) => t.id === table?.id);

  const { mutate: updatePublications, isPending: isTogglingRealtime } =
    useDatabasePublicationUpdateMutation({
      onSuccess: () => {
        setShowEnableRealtime(false);
      },
      onError: (error) => {
        toast.error(`Failed to toggle realtime for ${table.name}: ${error.message}`);
      },
    });

  const { can: canSqlWriteTables, isLoading: isLoadingPermissions } = {
    can: false,
    isLoading: false,
  }; //
  // useAsyncCheckProjectPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'tables');
  const { can: canSqlWriteColumns } = { can: false }; //
  //     useAsyncCheckProjectPermissions(
  //     PermissionAction.TENANT_SQL_ADMIN_WRITE,
  //     'columns'
  // );
  const isReadOnly = !isLoadingPermissions && !canSqlWriteTables && !canSqlWriteColumns;
  // This will change when we allow autogenerated API docs for schemas other than `public`
  const doesHaveAutoGeneratedAPIDocs = table.schema === "public";

  const { hasLint: viewHasLints, matchingLint: matchingViewLint } = {} as any;
  //     getEntityLintDetails(
  //     table.name,
  //     'security_definer_view',
  //     ['ERROR', 'WARN'],
  //     lints,
  //     table.schema
  // );

  const { hasLint: materializedViewHasLints, matchingLint: matchingMaterializedViewLint } =
    {} as any;
  // getEntityLintDetails(
  //     table.name,
  //     'materialized_view_in_api',
  //     ['ERROR', 'WARN'],
  //     lints,
  //     table.schema
  // );

  // const { mutate: sendEvent } = useSendEventMutation();

  const toggleRealtime = async () => {
    if (!project) return console.error("Project is required");
    if (!realtimePublication) return console.error("Unable to find realtime publication");

    const exists = realtimeEnabledTables.some((x: any) => x.id == table.id);
    const tables = !exists
      ? [`${table.schema}.${table.name}`].concat(
          realtimeEnabledTables.map((t: any) => `${t.schema}.${t.name}`),
        )
      : realtimeEnabledTables
          .filter((x: any) => x.id != table.id)
          .map((x: any) => `${x.schema}.${x.name}`);

    // sendEvent({
    //     action: 'realtime_toggle_table_clicked',
    //     properties: {
    //         newState: exists ? 'disabled' : 'enabled',
    //         origin: 'tableGridHeader',
    //     },
    //     groups: {
    //         project: project?.ref ?? 'Unknown',
    //         organization: org?.slug ?? 'Unknown',
    //     },
    // });

    updatePublications({
      projectRef,
      sdk,
      id: realtimePublication.id,
      tables,
    });
  };

  const onToggleRLS = async () => {
    const confirmed = await confirm({
      title: "Confirm to enable Row Level Security",
      description: "Are you sure you want to enable Row Level Security for this table?",
      confirm: {
        text: "Enable RLS",
      },
    });

    if (!confirmed) return;

    const payload = {
      id: table.id,
      rls_enabled: !(isTable && table.rls_enabled),
    };

    updateTable({
      projectRef,
      sdk,
      id: table.id,
      // name: table.name,
      schema: table.schema,
      payload: payload,
    });
  };

  return (
    <div className="sb-grid-header__inner">
      {showHeaderActions && (
        <div className="flex items-center gap-x-2">
          {isReadOnly && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="border border-strong rounded bg-overlay-hover px-3 py-1 text-xs">
                  Viewing as read-only
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                You need additional permissions to manage your project's data
              </TooltipContent>
            </Tooltip>
          )}

          {isTable && !isSchemaLocked ? (
            table.rls_enabled ? (
              <>
                {policies.length < 1 && !isSchemaLocked ? (
                  <Button
                    size="s"
                    variant="secondary"
                    type="default"
                    className="group"
                    prefixIcon={<PlusCircle strokeWidth={1.5} className="text-foreground-muted" />}
                    tooltip={
                      "RLS is enabled for this table, but no policies are set. Select queries may return 0 results."
                    }
                    href={`/project/${projectRef}/auth/policies?search=${table.id}&schema=${table.schema}`}
                  >
                    Add RLS policy
                  </Button>
                ) : (
                  <Button
                    size="s"
                    variant="secondary"
                    type={policies.length < 1 && !isSchemaLocked ? "warning" : "default"}
                    className="group"
                    prefixIcon={
                      isSchemaLocked || policies.length > 0 ? (
                        <div
                          className={cn(
                            "flex items-center justify-center rounded-full bg-border-stronger h-[16px]",
                            policies.length > 9 ? " px-1" : "w-[16px]",
                            "",
                          )}
                        >
                          <span className="text-[11px] text-foreground font-mono text-center">
                            {policies.length}
                          </span>
                        </div>
                      ) : (
                        <PlusCircle strokeWidth={1.5} />
                      )
                    }
                    href={`/project/${projectRef}/auth/policies?search=${table.id}&schema=${table.schema}`}
                  >
                    RLS {policies.length > 1 ? "policies" : "policy"}
                  </Button>
                )}
              </>
            ) : (
              <Popover modal={false} open={showWarning} onOpenChange={setShowWarning}>
                <PopoverTrigger asChild>
                  <Button size="s" variant="secondary" type="warning" prefixIcon={Lock}>
                    RLS disabled
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  // using `portal` for a safari fix. issue with rendering outside of body element
                  // portal
                  className="w-80 text-sm"
                  align="end"
                >
                  <h4 className="flex items-center gap-2">
                    <Lock size={16} /> Row Level Security (RLS)
                  </h4>
                  <div className="grid gap-2 mt-4 text-foreground-light text-xs">
                    <p>
                      You can restrict and control who can read, write and update data in this table
                      using Row Level Security.
                    </p>
                    <p>
                      With RLS enabled, anonymous users will not be able to read/write data in the
                      table.
                    </p>
                    {!isSchemaLocked && (
                      <Button type="default" className="mt-2 w-min" onClick={() => onToggleRLS()}>
                        Enable RLS for this table
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )
          ) : null}

          {isView && viewHasLints && (
            <Popover modal={false} open={showWarning} onOpenChange={setShowWarning}>
              <PopoverTrigger asChild>
                <Button type="warning" prefixIcon={<Unlock strokeWidth={1.5} />}>
                  Security Definer view
                </Button>
              </PopoverTrigger>
              <PopoverContent
                // using `portal` for a safari fix. issue with rendering outside of body element
                // portal
                className="min-w-[395px] text-sm"
                align="end"
              >
                <h3 className="flex items-center gap-2">
                  <Unlock size={16} /> Secure your View
                </h3>
                <div className="grid gap-2 mt-4 text-foreground-light text-sm">
                  <p>
                    This view is defined with the Security Definer property, giving it permissions
                    of the view's creator (Postgres), rather than the permissions of the querying
                    user.
                  </p>

                  <p>
                    Since this view is in the public schema, it is accessible via your project's
                    APIs.
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      type="secondary"
                      onClick={() => {
                        setIsAutofixViewSecurityModalOpen(true);
                      }}
                    >
                      Autofix
                    </Button>
                    <Button type="default" asChild>
                      <Link
                        target="_blank"
                        href={`/project/${ref}/advisors/security?preset=${matchingViewLint?.level}&id=${matchingViewLint?.cache_key}`}
                      >
                        Learn more
                      </Link>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {isMaterializedView && materializedViewHasLints && (
            <Popover modal={false} open={showWarning} onOpenChange={setShowWarning}>
              <PopoverTrigger asChild>
                <Button type="warning" prefixIcon={<Unlock strokeWidth={1.5} />}>
                  Security Definer view
                </Button>
              </PopoverTrigger>
              <PopoverContent
                // using `portal` for a safari fix. issue with rendering outside of body element
                // portal
                className="min-w-[395px] text-sm"
                align="end"
              >
                <h3 className="flex items-center gap-2">
                  <Unlock size={16} /> Secure your View
                </h3>
                <div className="grid gap-2 mt-4 text-foreground-light text-sm">
                  <p>
                    This view is defined with the Security Definer property, giving it permissions
                    of the view's creator (Postgres), rather than the permissions of the querying
                    user.
                  </p>

                  <p>
                    Since this view is in the public schema, it is accessible via your project's
                    APIs.
                  </p>

                  <div className="mt-2">
                    <Button type="default" asChild>
                      <Link
                        target="_blank"
                        href={`/project/${ref}/advisors/security?preset=${matchingMaterializedViewLint?.level}&id=${matchingMaterializedViewLint?.cache_key}`}
                      >
                        Learn more
                      </Link>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {isForeignTable && table.schema === "public" && (
            <Popover modal={false} open={showWarning} onOpenChange={setShowWarning}>
              <PopoverTrigger asChild>
                <Button type="warning" prefixIcon={<Unlock strokeWidth={1.5} />}>
                  Unprotected Data API access
                </Button>
              </PopoverTrigger>
              <PopoverContent
                // using `portal` for a safari fix. issue with rendering outside of body element
                // portal
                className="min-w-[395px] text-sm"
                align="end"
              >
                <h3 className="flex items-center gap-2">
                  <Unlock size={16} /> Secure Foreign table
                </h3>
                <div className="grid gap-2 mt-4 text-foreground-light text-sm">
                  <p>
                    Foreign tables do not enforce RLS, which may allow unrestricted access. To
                    secure them, either move foreign tables to a private schema not exposed by
                    PostgREST, or <a href="">disable PostgREST access</a> entirely.
                  </p>

                  <div className="mt-2">
                    <Button type="default" asChild>
                      <Link
                        target="_blank"
                        href="https://supabase.com/docs/guides/database/extensions/wrappers/overview#security"
                      >
                        Learn more
                      </Link>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* <RoleImpersonationPopover serviceRoleLabel="postgres" /> */}

          {isTable && realtimeEnabled && (
            <Button
              type="default"
              size="s"
              prefixIcon={
                <MousePointer2
                  strokeWidth={1.5}
                  className={isRealtimeEnabled ? "text-brand" : "text-foreground-muted"}
                />
              }
              onClick={() => setShowEnableRealtime(true)}
              className={cn(isRealtimeEnabled && "w-7 h-7 p-0 text-brand hover:text-brand-hover")}
              tooltip={
                isRealtimeEnabled
                  ? "Click to disable realtime for this table"
                  : "Click to enable realtime for this table"
              }
            >
              {!isRealtimeEnabled && "Enable Realtime"}
            </Button>
          )}

          {/* {doesHaveAutoGeneratedAPIDocs && <APIDocsButton section={['entities', table.name]} />} */}

          <RefreshButton tableId={table.id} isRefetching={isRefetching} />
        </div>
      )}
      <ConfirmationModal
        visible={showEnableRealtime}
        loading={isTogglingRealtime}
        title={`${isRealtimeEnabled ? "Disable" : "Enable"} realtime for ${table.name}`}
        confirmLabel={`${isRealtimeEnabled ? "Disable" : "Enable"} realtime`}
        confirmLabelLoading={`${isRealtimeEnabled ? "Disabling" : "Enabling"} realtime`}
        onCancel={() => setShowEnableRealtime(false)}
        onConfirm={() => toggleRealtime()}
      >
        <div className="space-y-2">
          <p className="text-sm">
            Once realtime has been {isRealtimeEnabled ? "disabled" : "enabled"}, the table will{" "}
            {isRealtimeEnabled ? "no longer " : ""}broadcast any changes to authorized subscribers.
          </p>
          {!isRealtimeEnabled && (
            <p className="text-sm">
              You may also select which events to broadcast to subscribers on the{" "}
              <Link href={`/project/${ref}/database/publications`} className="text-brand">
                database publications
              </Link>{" "}
              settings.
            </p>
          )}
        </div>
      </ConfirmationModal>

      {/* <ViewEntityAutofixSecurityModal
                table={table}
                isAutofixViewSecurityModalOpen={isAutofixViewSecurityModalOpen}
                setIsAutofixViewSecurityModalOpen={setIsAutofixViewSecurityModalOpen}
            /> */}

      {/* {isTable && (
                <Cone
                    danger={table.rls_enabled}
                    visible={rlsConfirmModalOpen}
                    title="Confirm to enable Row Level Security"
                    description="Are you sure you want to enable Row Level Security for this table?"
                    buttonLabel="Enable RLS"
                    buttonLoadingLabel="Updating"
                    onSelectCancel={closeConfirmModal}
                    onSelectConfirm={onToggleRLS}
                />
            )} */}
    </div>
  );
};
