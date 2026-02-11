"use client";

import { ToggleButton } from "@nuvix/ui/components";

export const HomeButton = () => {
  const getHomeUrl = () => {
    if (typeof window === "undefined") return "/";

    const origin = window.location.origin;
    if (origin.includes("docs.")) {
      return origin.replace("docs.", "").replace("/docs", "");
    }
  };

  return (
    <ToggleButton variant="ghost" className="font-solid" href={getHomeUrl()}>
      Home
    </ToggleButton>
  );
};
