"use client";
import { useAppStore } from "@/lib/store";
import { Avatar } from "@nuvix/cui/avatar";
import { cn } from "@nuvix/sui/lib/utils";
import { Column, Icon, IconButton } from "@nuvix/ui/components";

export const RightSidebar = () => {
  const open = useAppStore.use.rightSidebarOpen();
  const setOpen = useAppStore.use.setRightSidebarOpen();

  return (
    <Column
      width={open ? "56" : "8"}
      padding="8"
      paddingY="12"
      fillHeight
      horizontal="center"
      gap="12"
      className="transition-width duration-300"
    >
      <div
        className={cn(
          "gap-6 flex flex-col visible opacity-100 ease-in transition-opacity duration-300",
          { "invisible opacity-30": !open },
        )}
      >
        {open && (
          <>
            <Avatar size={"sm"} fallback={<Icon name="sparkle" />} colorPalette={"teal"} />
            <Avatar size={"sm"} fallback={<Icon name="code" />} colorPalette={"yellow"} />
            <Avatar size={"sm"} fallback={<Icon name="discord" />} colorPalette={"purple"} />
            <Avatar size={"sm"} fallback={<Icon name="plus" />} />
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
