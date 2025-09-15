import type { PostgresPolicy } from "@nuvix/pg-meta";
import { noop } from "lodash";
import { MoreVertical } from "lucide-react";

// import { useAuthConfigQuery } from "@/data/auth/auth-config-query";
// import { useAiAssistantStateSnapshot } from "state/ai-assistant-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { generatePolicyUpdateSQL } from "./PolicyTableRow.utils";
import { useCheckPermission } from "@/hooks/useCheckPermissions";
import { PermissionAction } from "@/types";
import { useProjectStore } from "@/lib/store";
import { TableCell, TableRow } from "@nuvix/sui/components/table";
import { Button, Icon, IconButton } from "@nuvix/ui/components";

interface PolicyRowProps {
  policy: PostgresPolicy;
  onSelectEditPolicy: (policy: PostgresPolicy) => void;
  onSelectDeletePolicy: (policy: PostgresPolicy) => void;
  isLocked?: boolean;
}

export const PolicyRow = ({
  policy,
  isLocked: isLockedDefault = false,
  onSelectEditPolicy = noop,
  onSelectDeletePolicy = noop,
}: PolicyRowProps) => {
  // const aiSnap = useAiAssistantStateSnapshot();
  const { can: canUpdatePolicies } = useCheckPermission(
    PermissionAction.TENANT_SQL_ADMIN_WRITE,
    "policies",
  );

  const { project } = useProjectStore();

  // override islocked for Realtime messages table
  const isLocked =
    policy.schema === "realtime" && policy.table === "messages" ? false : isLockedDefault;

  // TODO(km): Simple check for roles that allow authenticated access.
  // In the future, we'll use splinter to return proper warnings for policies that allow anonymous user access.
  const appliesToAnonymousUsers = true;
  // authConfig?.EXTERNAL_ANONYMOUS_USERS_ENABLED &&
  // (policy.roles.includes("authenticated") || policy.roles.includes("public"));

  const displayedRoles = (() => {
    const rolesWithAnonymous = appliesToAnonymousUsers
      ? [...policy.roles, "anonymous sign-ins"]
      : policy.roles;
    return rolesWithAnonymous;
  })();

  return (
    <TableRow>
      <TableCell className="w-[40%] truncate">
        <div className="flex items-center gap-x-2 min-w-0">
          <Button
            type="text"
            size="xs"
            className="!text-foreground !text-sm !p-0 !bg-transparent hover:!bg-transparent !w-full !truncate !justify-start"
            onClick={() => onSelectEditPolicy(policy)}
          >
            {policy.name}
          </Button>
        </div>
      </TableCell>
      <TableCell className="w-[20%] truncate">
        <code className="neutral-on-background-medium !text-xs">{policy.command}</code>
      </TableCell>
      <TableCell className="w-[30%] truncate">
        <div className="flex items-center gap-x-1">
          <div className="neutral-on-background-weak text-sm truncate">
            {displayedRoles.slice(0, 2).map((role, i) => (
              <span key={`policy-${role}-${i}`}>
                <code className="text-xs">{role}</code>
                {i < Math.min(displayedRoles.length, 2) - 1 ? ", " : " "}
              </span>
            ))}
          </div>
          {displayedRoles.length > 2 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <code key="policy-etc" className="neutral-on-background-medium !text-xs">
                    + {displayedRoles.length - 2} more
                  </code>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                {displayedRoles.join(", ")}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
      <TableCell className="w-0 !text-right whitespace-nowrap">
        {!isLocked && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="ml-auto">
              <IconButton variant="secondary" size="s" icon={MoreVertical} />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="w-52">
              <DropdownMenuItem
                className="gap-x-2 !text-xs"
                onClick={() => onSelectEditPolicy(policy)}
              >
                <Icon name={"edit"} size="xs" />
                <p>Edit policy</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-x-2 !text-xs"
                onClick={() => {
                  const sql = generatePolicyUpdateSQL(policy);
                  // aiSnap.newChat({
                  //   name: `Update policy ${policy.name}`,
                  //   open: true,
                  //   sqlSnippets: [sql],
                  //   initialInput: `Update the policy with name \"${policy.name}\" in the ${policy.schema} schema on the ${policy.table} table. It should...`,
                  //   suggestions: {
                  //     title: `I can help you make a change to the policy \"${policy.name}\" in the ${policy.schema} schema on the ${policy.table} table, here are a few example prompts to get you started:`,
                  //     prompts: [
                  //       {
                  //         label: "Improve Policy",
                  //         description: "Tell me how I can improve this policy...",
                  //       },
                  //       {
                  //         label: "Duplicate Policy",
                  //         description: "Duplicate this policy for another table...",
                  //       },
                  //       {
                  //         label: "Add Conditions",
                  //         description: "Add extra conditions to this policy...",
                  //       },
                  //     ],
                  //   },
                  // });
                }}
              >
                <Icon name={"edit"} size="xs" />
                <p>Edit policy with Assistant</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Tooltip>
                <TooltipContent side="left" align="center">
                  You need additional permissions to delete policies
                </TooltipContent>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    className="gap-x-2 !text-xs"
                    disabled={!canUpdatePolicies}
                    onClick={() => onSelectDeletePolicy(policy)}
                  >
                    <Icon name={"trash"} size="xs" />
                    <p>Delete policy</p>
                  </DropdownMenuItem>
                </TooltipTrigger>
              </Tooltip>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
};
