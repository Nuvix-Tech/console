import { noop } from "lodash";
import { Lock } from "lucide-react";

import { EditorTablePageLink } from "@/data/prefetchers/project.$ref.editor.$id";
import { useParams } from "next/navigation";
import { useCheckPermission } from "@/hooks/useCheckPermissions";
import { PermissionAction } from "@/types";
import { CardTitle } from "@nuvix/sui/components/card";
import { Badge } from "@nuvix/sui/components/badge";
import { Button, Icon, IconButton } from "@nuvix/ui/components";

interface PolicyTableRowHeaderProps {
  table: {
    id: number;
    schema: string;
    name: string;
    rls_enabled: boolean;
  };
  isLocked: boolean;
  onSelectToggleRLS: (table: {
    id: number;
    schema: string;
    name: string;
    rls_enabled: boolean;
  }) => void;
  onSelectCreatePolicy: () => void;
}

export const PolicyTableRowHeader = ({
  table,
  isLocked,
  onSelectToggleRLS = noop,
  onSelectCreatePolicy,
}: PolicyTableRowHeaderProps) => {
  const { id: ref } = useParams();
  // const aiSnap = useAiAssistantStateSnapshot();

  const { can: canCreatePolicies } = useCheckPermission(
    PermissionAction.TENANT_SQL_ADMIN_WRITE,
    "policies",
  );
  const { can: canToggleRLS } = useCheckPermission(
    PermissionAction.TENANT_SQL_ADMIN_WRITE,
    "tables",
  );

  const isRealtimeSchema = table.schema === "realtime";
  const isRealtimeMessagesTable = isRealtimeSchema && table.name === "messages";
  const isTableLocked = isRealtimeSchema ? !isRealtimeMessagesTable : isLocked;

  return (
    <div id={table.id.toString()} className="flex w-full items-center justify-between">
      <div className="flex gap-x-4 text-left">
        <EditorTablePageLink
          projectRef={ref as string}
          id={String(table.id)}
          className="flex items-center gap-x-3"
        >
          <Icon name="table" size="s" />
          <CardTitle className="m-0 normal-case">{table.name}</CardTitle>
          {!table.rls_enabled && <Badge variant="outline">RLS Disabled</Badge>}
        </EditorTablePageLink>
        {isTableLocked && (
          <Badge variant={"outline"}>
            <span className="flex gap-2 items-center text-xs uppercase neutral-on-background-weak">
              <Lock size={12} /> Locked
            </span>
          </Badge>
        )}
      </div>
      {!isTableLocked && (
        <div className="flex-1">
          <div className="flex flex-row justify-end gap-x-2">
            {!isRealtimeMessagesTable && (
              <Button
                type="default"
                size="xs"
                variant="secondary"
                disabled={!canToggleRLS}
                onClick={() => onSelectToggleRLS(table)}
                tooltip={
                  !canToggleRLS ? "You need additional permissions to toggle RLS" : undefined
                }
                tooltipPosition="bottom"
              >
                {table.rls_enabled ? "Disable RLS" : "Enable RLS"}
              </Button>
            )}
            <Button
              type="default"
              size="xs"
              variant="secondary"
              disabled={!canToggleRLS || !canCreatePolicies}
              onClick={() => onSelectCreatePolicy()}
              tooltip={
                !canToggleRLS
                  ? !canToggleRLS || !canCreatePolicies
                    ? "You need additional permissions to create RLS policies"
                    : undefined
                  : undefined
              }
              tooltipPosition="bottom"
            >
              Create policy
            </Button>

            {/* <IconButton
              type="default"
              size="s"
              variant="secondary"
              className="px-1"
              onClick={() => {
                // aiSnap.newChat({
                //   name: 'Create new policy',
                //   open: true,
                //   initialInput: `Create and name a new policy for the ${table.schema} schema on the ${table.name} table that ...`,
                // });
              }}
              tooltip={
                !canToggleRLS || !canCreatePolicies
                  ? "You need additional permissions to create RLS policies"
                  : "Create with Nuvix Assistant"
              }
              tooltipPosition="bottom"
              icon="sparkle"
            ></IconButton> */}
          </div>
        </div>
      )}
    </div>
  );
};
