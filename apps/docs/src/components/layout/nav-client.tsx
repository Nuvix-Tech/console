"use client";

import { ToggleButton } from "@nuvix/ui/components";

export const HomeButton = () => {
  return (
    <ToggleButton
      variant="ghost"
      className="font-solid"
      href={window.location.origin.replace("docs.", "").replace("/docs", "")}
    >
      Home
    </ToggleButton>
  );
};
