"use client";
import { useAppStore } from "@/lib/store";
import { Avatar } from "@nuvix/cui/avatar";
import { Column, IconButton } from "@nuvix/ui/components";

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
    >
      {open && (
        <>
          <Avatar size={"sm"} fallback={"AI"} />
          <Avatar size={"sm"} fallback={"VI"} />
          <Avatar size={"sm"} fallback={"P"} />
        </>
      )}

      <IconButton
        icon={"chevronLeft"}
        size="s"
        onClick={() => setOpen(!open)}
        variant="secondary"
        className="mt-auto"
      />
    </Column>
  );
};
