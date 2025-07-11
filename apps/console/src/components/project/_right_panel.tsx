"use client";

import { useProjectStore } from "@/lib/store";
import { MainArea } from "./main-area";

export const RightPanel = () => {
  const { panel } = useProjectStore((s) => s);

  return panel && panel.open ? (
    <MainArea as={"aside"} ml={"2.5"} width={"xs"}>
      {panel.node}
    </MainArea>
  ) : null;
};
