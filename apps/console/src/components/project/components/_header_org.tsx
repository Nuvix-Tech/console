"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import { Row, Skeleton, Button } from "@nuvix/ui/components";
import { cn } from "@nuvix/sui/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@nuvix/sui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@nuvix/sui/components/popover";
import { sdkForConsole } from "@/lib/sdk";
import { useRouter } from "@bprogress/next";
import { Models } from "@nuvix/console";
import { useAppStore } from "@/lib/store";

export function HeaderOrganization(props: React.ComponentProps<typeof Button>) {
  const organization = useAppStore.use.organization?.();
  const { organizations: orgApi } = sdkForConsole;
  const [orgs, setOrgs] = React.useState<Models.Organization<any>[]>();
  const { push } = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    async function getAll() {
      const orgs = await orgApi.list<any>();
      setOrgs(orgs.teams);
    }
    getAll();
  }, []);

  return organization && orgs ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          size="s"
          aria-expanded={open}
          className="dark:!border-border/30"
          justifyContent="flex-start"
          weight="default"
          suffixIcon={<ChevronsUpDown className="opacity-40" size={16} />}
          {...props}
        >
          <span className="max-w-42 text-ellipsis overflow-hidden">
            {organization
              ? orgs.find((org) => org.$id === organization.$id)?.name
              : "Select organization..."}
          </span>
          <span className="ml-2 bg-[var(--neutral-alpha-weak)] text-sm font-thin px-2 py-0.5 rounded-md">
            Free
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." className="h-9" />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              {orgs.map((org) => (
                <CommandItem
                  key={org.$id}
                  value={org.$id}
                  onSelect={(currentValue) => {
                    push(`/organization/${currentValue}`);
                    setOpen(false);
                  }}
                >
                  {org.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      organization.$id === org.$id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                className="cursor-pointer flex items-center gap-x-2 w-full"
                onSelect={() => {
                  setOpen(false);
                }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <PlusIcon size={12} />
                Create Organization
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  ) : (
    <Row width="128" height={"32"}>
      <Skeleton shape="block" fillWidth radius="l" />
    </Row>
  );
}
