"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@nuvix/sui/lib/utils";
import { Column, Icon, IconButton } from "@nuvix/ui/components";
import { ThemeSelector } from "@nuvix/sui/components/ThemeSelector";

export const RightSidebar = () => {
  const [open, setOpen] = useLocalStorage("right-sidebar", false);

  return (
    <Column
      width={open ? "56" : "8"}
      padding="8"
      paddingY="12"
      fillHeight
      horizontal="center"
      gap="12"
      className="transition-width duration-300 !hidden ml:!flex"
    >
      <div
        className={cn(
          "gap-6 flex flex-col visible opacity-100 ease-in transition-opacity duration-300",
          { "invisible opacity-30": !open },
        )}
      >
        {open && (
          <>
            <IconButton icon="sparkle" variant="secondary" tooltip="AI Assistant" disabled />
            <IconButton icon="search" variant="secondary" tooltip="Search" disabled />
            <IconButton icon="github" variant="secondary" tooltip="Git" disabled />
            <IconButton icon="settings" variant="secondary" tooltip="Settings" disabled />
            <IconButton icon="plus" variant="secondary" tooltip="New File" disabled />
            <ThemeSelector className="mx-auto size-7" />
          </>
        )}
      </div>

      <button
        className={cn(
          "neutral-background-weak hover:!bg-[var(--surface-background)] cursor-pointer flex items-center justify-center rounded-full size-6 p-1 transition-all duration-300 mt-auto",
          {
            "w-12 h-6 shadow-md z-2 rounded-l-full rounded-r-none justify-start pl-2": !open,
            "border neutral-border-medium": open,
          },
        )}
        onClick={() => setOpen(!open)}
      >
        <Icon
          name={"chevronRight"}
          size="s"
          className={cn("transition-all duration-300", { "rotate-180": !open })}
        />
      </button>
    </Column>
  );
};
