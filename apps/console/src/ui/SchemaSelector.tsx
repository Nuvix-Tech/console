// import { PermissionAction } from '@supabase/shared-types/out/constants'
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";

import { useSchemasQuery } from "@/data/database/schemas-query";
// import { useCheckPermissions } from 'hooks/misc/useCheckPermissions'
import { AlertDescription, AlertTitle, Alert } from "@nuvix/sui/components/alert";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Command,
} from "@nuvix/sui/components/command";
import { PopoverContent, PopoverTrigger, Popover } from "@nuvix/sui/components/popover";
import { ScrollArea } from "@nuvix/sui/components/scroll-area";
import { Skeleton } from "@nuvix/sui/components/skeleton";
import { useProjectStore } from "@/lib/store";
import { Button } from "@nuvix/ui/components";
import { useGetSchemaType } from "@/hooks/useProtectedSchemas";

interface SchemaSelectorProps {
  className?: string;
  disabled?: boolean;
  size?: "s" | "m" | "l";
  showError?: boolean;
  selectedSchemaName: string;
  supportSelectAll?: boolean;
  excludedSchemas?: string[];
  onSelectSchema: (name: string) => void;
  onSelectCreateSchema?: () => void;
}

const SchemaSelector = ({
  className,
  disabled = false,
  size = "s",
  showError = true,
  selectedSchemaName,
  supportSelectAll = false,
  excludedSchemas = [],
  onSelectSchema,
  onSelectCreateSchema,
}: SchemaSelectorProps) => {
  const [open, setOpen] = useState(false);
  const canCreateSchemas = true; // useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'schemas')
  const { getSchemaType } = useGetSchemaType();

  const { project, sdk } = useProjectStore();
  const {
    data,
    isLoading: isSchemasLoading,
    isSuccess: isSchemasSuccess,
    isError: isSchemasError,
    error: schemasError,
    refetch: refetchSchemas,
  } = useSchemasQuery({
    projectRef: project?.$id,
    sdk,
  });

  const schemas = (data || [])
    .filter((schema) => !excludedSchemas.includes(schema.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={className}>
      {isSchemasLoading && (
        <Button
          fillWidth
          variant="secondary"
          key="schema-selector-skeleton"
          className="w-full [&>span]:w-full"
          size={size}
          disabled
        >
          <Skeleton className="w-full h-3 bg-foreground-muted" />
        </Button>
      )}

      {showError && isSchemasError && (
        <Alert variant="error">
          <AlertTitle className="text-xs">Failed to load schemas</AlertTitle>
          <AlertDescription className="text-xs mb-1.5 break-words">
            {(schemasError as any)?.message}
          </AlertDescription>
          <Button variant="primary" size="s" onClick={() => refetchSchemas()}>
            Reload schemas
          </Button>
        </Alert>
      )}

      {isSchemasSuccess && (
        <Popover open={open} onOpenChange={setOpen} modal={false}>
          <PopoverTrigger asChild>
            <Button
              fillWidth
              size={size}
              disabled={disabled}
              justifyContent="space-between"
              variant="secondary"
              data-testid="schema-selector"
              className={`w-full [&>span]:w-full !pr-1 space-x-1`}
              suffixIcon={
                <ChevronsUpDown className="text-muted-foreground" strokeWidth={2} size={14} />
              }
            >
              {selectedSchemaName ? (
                <div className="w-full flex gap-1">
                  <p className="text-muted-foreground">schema</p>
                  <p className="text-foreground">
                    {selectedSchemaName === "*" ? "All schemas" : selectedSchemaName}
                  </p>
                </div>
              ) : (
                <div className="w-full flex gap-1">
                  <p className="text-muted-foreground">Choose a schema…</p>
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 min-w-[200px] pointer-events-auto"
            side="bottom"
            align="start"
            // portal={true}
            // sameWidthAsTrigger
          >
            <Command>
              <CommandInput placeholder="Find schema..." />
              <CommandList>
                <CommandEmpty>No schemas found</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className={(schemas || []).length > 7 ? "h-[210px]" : ""}>
                    {supportSelectAll && (
                      <CommandItem
                        key="select-all"
                        className="cursor-pointer flex items-center justify-between space-x-2 w-full"
                        onSelect={() => {
                          onSelectSchema("*");
                          setOpen(false);
                        }}
                        onClick={() => {
                          onSelectSchema("*");
                          setOpen(false);
                        }}
                      >
                        <span>All schemas</span>
                        {selectedSchemaName === "*" && (
                          <Check className="text-brand" strokeWidth={2} size={16} />
                        )}
                      </CommandItem>
                    )}
                    {schemas?.map((schema) => (
                      <CommandItem
                        key={schema.id}
                        className="cursor-pointer flex items-center justify-between space-x-2 w-full"
                        onSelect={() => {
                          onSelectSchema(schema.name);
                          setOpen(false);
                        }}
                        onClick={() => {
                          onSelectSchema(schema.name);
                          setOpen(false);
                        }}
                      >
                        <span>{schema.name}</span>
                        <span className="text-[11px] ml-auto neutral-on-background-weak uppercase flex items-center gap-1 font-light">
                          {selectedSchemaName === schema.name && (
                            <Check className="brand-on-background-weak" strokeWidth={2} size={16} />
                          )}
                          {getSchemaType(schema.name)}
                        </span>
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
                {onSelectCreateSchema !== undefined && canCreateSchemas && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        className="cursor-pointer flex items-center gap-x-2 w-full"
                        onSelect={() => {
                          onSelectCreateSchema();
                          setOpen(false);
                        }}
                        onClick={() => {
                          onSelectCreateSchema();
                          setOpen(false);
                        }}
                      >
                        <Plus size={12} />
                        Create a new schema
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default SchemaSelector;
