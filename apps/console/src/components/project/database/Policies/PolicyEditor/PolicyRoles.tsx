// import { SYSTEM_ROLES } from 'components/interfaces/Database/Roles/Roles.constants';
// import ShimmeringLoader from 'components/ui/ShimmeringLoader';
import AlertError from "@/components/others/ui/alert-error";
import { useDatabaseRolesQuery } from "@/data/database-roles/database-roles-query";
import { useProjectStore } from "@/lib/store";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/ui/MultiSelect";
import { sortBy } from "lodash";

const SYSTEM_ROLES: string[] = [];

interface PolicyRolesProps {
  selectedRoles: string[];
  onUpdateSelectedRoles: (roles: string[]) => void;
}
type SystemRole = (typeof SYSTEM_ROLES)[number];

const PolicyRoles = ({ selectedRoles, onUpdateSelectedRoles }: PolicyRolesProps) => {
  const { project, sdk } = useProjectStore((s) => s);
  const { data, error, isLoading, isError, isSuccess } = useDatabaseRolesQuery({
    projectRef: project?.$id,
    sdk,
  });
  const roles = sortBy(
    (data ?? []).filter((role) => !SYSTEM_ROLES.includes(role.name as SystemRole)),
    (r) => r.name.toLocaleLowerCase(),
  );

  const formattedRoles = roles.map((role) => {
    return {
      id: role.id,
      name: role.name,
      value: role.name,
      disabled: false,
    };
  });

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-12">
      <div className="flex md:w-1/3 flex-col space-y-2">
        <label className="neutral-on-background-medium text-base" htmlFor="policy-name">
          Target roles
        </label>
        <p className="neutral-on-background-weak text-sm">Apply policy to the selected roles</p>
      </div>
      <div className="relative md:w-2/3">
        {isLoading && (
          <div className="animate-pulse">
            <div className="mb-2 h-6 w-1/3 rounded bg-foreground/10" />
            <div className="h-10 w-full rounded bg-foreground/10" />
          </div>
          // <ShimmeringLoader className="py-4" />
        )}
        {isError && <AlertError error={error as any} subject="Failed to retrieve database roles" />}
        {isSuccess && (
          <MultiSelector
            values={selectedRoles}
            // searchPlaceholder="Search for a role"
            onValuesChange={onUpdateSelectedRoles}
          >
            <MultiSelectorTrigger />
            <MultiSelectorContent>
              <MultiSelectorList>
                {formattedRoles.map((role) => (
                  <MultiSelectorItem key={role.id} value={role.value} disabled={role.disabled}>
                    {role.name}
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
        )}
      </div>
    </div>
  );
};

export default PolicyRoles;
