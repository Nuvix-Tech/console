"use client";
import { DialogRoot } from "@/components/cui/dialog";
import { Targets } from "@/components/wizard/messaging/targets";
import { useProjectStore } from "@/lib/store";
import { Models } from "@nuvix/console";
import React, { useMemo, useState } from "react";
import { useTopicStore } from "../components/store";

interface CreateSubscribersProps {
  onClose: () => void;
  isOpen: boolean;
}

export const CreateSubscribers = ({ onClose, isOpen }: CreateSubscribersProps) => {
  const [targetsById, setTargetsById] = useState<Map<string, Models.Target>>(new Map());
  const { sdk } = useProjectStore((state) => state);
  const { topic } = useTopicStore((state) => state);

  const hasTargets = useMemo(() => targetsById.size > 0, [targetsById]);
  const addTargets = (newTargets: Record<string, Models.Target>) => {
    const targetsMap = new Map<string, Models.Target>();
    Object.entries(newTargets).forEach(([id, target]) => {
      targetsMap.set(id, target);
    });
    setTargetsById(targetsMap);
    const newValues = Array.from(targetsMap.keys());
    // TODO: -------------------
  };

  return (
    <>
      <DialogRoot
        open={isOpen}
        onOpenChange={({ open }) => onClose()}
        closeOnEscape={false}
        closeOnInteractOutside={false}
      >
        <Targets
          add={(targets) => addTargets({ [targets.$id]: targets })}
          sdk={sdk}
          onClose={() => onClose()}
          groups={targetsById}
          title="Select Subscribers"
        />
      </DialogRoot>
    </>
  );
};
