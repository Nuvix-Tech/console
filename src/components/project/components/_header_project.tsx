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
import { getProjectState } from "@/state/project-state";

export function HeaderProject() {
  const { project } = getProjectState();
  const { projects } = sdkForConsole;
  const [list, setList] = React.useState<Models.Project[]>();
  const { push } = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    async function getAll() {
      const all = await projects.list();
      setList(all.projects);
    }
    getAll();
  }, []);

  return project && list ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-[150px] justify-between"
        >
          {project ? list.find((p) => p.$id === project.$id)?.name : "Select project..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search project..." className="h-9" />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
              {list.map((p) => (
                <CommandItem
                  key={p.$id}
                  value={p.$id}
                  onSelect={(currentValue) => {
                    push(`/console/project/${currentValue}`);
                    setOpen(false);
                  }}
                >
                  {p.name}
                  <Check
                    className={cn("ml-auto", project.$id === p.$id ? "opacity-100" : "opacity-0")}
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
