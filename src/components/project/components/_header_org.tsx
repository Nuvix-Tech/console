"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { sdkForConsole } from "@/lib/sdk";
import { useRouter } from "@bprogress/next";
import { Models } from "@nuvix/console";
import { useAppStore } from "@/lib/store";

export function HeaderOrganization() {
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
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="justify-between gap-3 max-w-42"
        >
          {organization
            ? orgs.find((org) => org.$id === organization.$id)?.name
            : "Select organization..."}
          <ChevronsUpDown className="opacity-40" />
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
                    push(`/organizations/${currentValue}`);
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  ) : (
    <Skeleton />
  );
}
