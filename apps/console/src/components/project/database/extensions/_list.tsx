import { isNull, partition } from "lodash";
import { AlertCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { useDatabaseExtensionsQuery } from "@/data/database-extensions/database-extensions-query";
import ExtensionCard from "./_card";
import ExtensionCardSkeleton from "./_card_skeleton";
import { HIDDEN_EXTENSIONS, SEARCH_TERMS } from "./_constants";
import { useSearchParams } from "next/navigation";
import { useProjectStore } from "@/lib/store";
import { Input } from "@chakra-ui/react";
import { InputGroup } from "@nuvix/cui/input-group";
import { DocsButton } from "@/ui/DocsButton";
import InformationBox from "@/ui/InformationBox";
import { Skeleton } from "@nuvix/cui/skeleton";
import { EmptyResults } from "@/ui/data-grid/empty-results";

const Extensions = () => {
  const params = useSearchParams();
  const filter = params.get("filter");
  const { project, sdk } = useProjectStore((s) => s);
  const [filterString, setFilterString] = useState<string>("");

  const { data, isLoading } = useDatabaseExtensionsQuery({
    projectRef: project.$id,
    sdk,
  });

  const extensions =
    filterString?.length === 0
      ? (data ?? [])
      : (data ?? []).filter((ext: any) => {
          const nameMatchesSearch = ext.name.toLowerCase().includes(filterString.toLowerCase());
          const searchTermsMatchesSearch = (SEARCH_TERMS[ext.name] || []).some((x) =>
            x.includes(filterString.toLowerCase()),
          );
          return nameMatchesSearch || searchTermsMatchesSearch;
        });
  const extensionsWithoutHidden = extensions.filter(
    (ext: any) => !HIDDEN_EXTENSIONS.includes(ext.name),
  );
  const [enabledExtensions, disabledExtensions] = partition(
    extensionsWithoutHidden,
    (ext) => !isNull(ext.installed_version),
  );

  const canUpdateExtensions = true; // useCheckPermissions(
  //     PermissionAction.TENANT_SQL_ADMIN_WRITE,
  //     'extensions'
  // )
  const isPermissionsLoaded = true; // usePermissionsLoaded()

  useEffect(() => {
    if (filter !== undefined) setFilterString((filter as string) ?? "");
  }, [filter]);

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <InputGroup startElement={<Search size={14} />}>
            <Input
              size="sm"
              placeholder="Search for an extension"
              value={filterString}
              onChange={(e) => setFilterString(e.target.value)}
              className="w-52"
            />
          </InputGroup>
          <DocsButton href="https://supabase.com/docs/guides/database/extensions" />
        </div>
      </div>

      {isPermissionsLoaded && !canUpdateExtensions && (
        <InformationBox
          icon={<AlertCircle className="text-foreground-light" size={18} strokeWidth={2} />}
          title="You need additional permissions to update database extensions"
        />
      )}

      {isLoading ? (
        <div className="my-8 w-full space-y-12">
          <div className="space-y-4">
            <Skeleton className="h-[28px] w-40" />

            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ExtensionCardSkeleton key={index} index={index} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {extensions.length === 0 && (
            <EmptyResults
            // searchString={filterString}
            // onResetFilter={() => setFilterString('')}
            />
          )}

          <div className="my-2 w-full space-y-12">
            {enabledExtensions.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg">Enabled extensions</h4>
                <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {enabledExtensions.map((extension) => (
                    <ExtensionCard key={extension.name} extension={extension} />
                  ))}
                </div>
              </div>
            )}

            {disabledExtensions.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg">Available extensions</h4>
                <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {disabledExtensions.map((extension) => (
                    <ExtensionCard key={extension.name} extension={extension} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Extensions;
