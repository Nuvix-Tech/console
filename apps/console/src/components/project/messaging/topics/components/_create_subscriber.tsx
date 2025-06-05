"use client";
import { DialogRoot } from "@/components/cui/dialog";
import { Targets } from "@/components/wizard/messaging/targets";
import { useProjectStore } from "@/lib/store";
import { Models } from "@nuvix/console";
import React, { useCallback, useMemo, useState } from "react";
import { useTopicStore } from "./store";

interface CreateSubscribersProps {
  onClose: () => void;
  isOpen: boolean;
}

export const CreateSubscribers = ({ onClose, isOpen }: CreateSubscribersProps) => {
  const [targetsById, setTargetsById] = useState<Map<string, Models.Target>>(new Map());
  const { sdk } = useProjectStore((state) => state);
  const { topic } = useTopicStore((state) => state);

  const hasTargets = useMemo(() => targetsById.size > 0, [targetsById]);

  const addTargets = useCallback((newTargets: Record<string, Models.Target>) => {
    setTargetsById((prevTargets) => {
      const targetsMap = new Map(prevTargets);
      Object.entries(newTargets).forEach(([id, target]) => {
        targetsMap.set(id, target);
      });
      return targetsMap;
    });
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleDialogOpenChange = useCallback(
    ({ open }: { open: boolean }) => {
      if (!open) {
        handleClose();
      }
    },
    [handleClose],
  );

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={handleDialogOpenChange}
      closeOnEscape={false}
      closeOnInteractOutside={false}
    >
      <Targets
        add={(targets) => addTargets({ [targets.$id]: targets })}
        sdk={sdk}
        onClose={handleClose}
        groups={targetsById}
        title="Select Subscribers"
      />
    </DialogRoot>
  );
};
