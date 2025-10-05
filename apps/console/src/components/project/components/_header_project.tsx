"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import { Button, Row, Skeleton } from "@nuvix/ui/components";
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
import { useParams } from "next/navigation";
import { useWizard } from "@/hooks/useWizard";
import { IS_PLATFORM } from "@/lib/constants";

export function HeaderProject(props: React.ComponentProps<typeof Button>) {
  const { id: projectId } = useParams();
  const { projects } = sdkForConsole;
  const [list, setList] = React.useState<Models.Project[]>();
  const { push } = useRouter();
  const [open, setOpen] = React.useState(false);

  const { createProject } = useWizard();

  React.useEffect(() => {
    async function getAll() {
      const all = await projects.list();
      setList(all.data);
    }
    getAll();
  }, []);

  return list ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          size="s"
          className="dark:!border-border/30"
          weight="default"
          justifyContent="flex-start"
          suffixIcon={<ChevronsUpDown className="opacity-40" size={16} />}
          {...props}
        >
          <span className="max-w-42 text-ellipsis overflow-hidden">
            {list.find((p) => p.$id === projectId)?.name || "Select project..."}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-transparent border-[var(--neutral-border-medium)]">
        <Command
          filter={(value, search) => {
            if (value === "") {
              return 0;
            }
            const item = list.find((p) => p.$id === value);
            if (item) {
              return item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.$id.toLowerCase().includes(search.toLowerCase())
                ? 1
                : 0;
            }
            return 0;
          }}
        >
          <CommandInput placeholder="Search project..." className="h-9" />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
              {list.map((p) => (
                <CommandItem
                  key={p.$id}
                  value={p.$id}
                  onSelect={(currentValue) => {
                    push(`/project/${currentValue}`);
                    setOpen(false);
                  }}
                >
                  {p.name}
                  <Check
                    className={cn("ml-auto", projectId === p.$id ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {IS_PLATFORM && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className="cursor-pointer flex items-center gap-x-2 w-full"
                    onSelect={() => {
                      createProject();
                      setOpen(false);
                    }}
                    onClick={() => {
                      createProject();
                      setOpen(false);
                    }}
                  >
                    <PlusIcon size={12} />
                    Create Project
                  </CommandItem>
                </CommandGroup>
              </>
            )}
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
