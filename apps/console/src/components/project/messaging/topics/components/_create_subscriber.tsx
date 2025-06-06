"use client";
import { DialogRoot } from "@/components/cui/dialog";
import { Targets } from "@/components/wizard/messaging/targets";
import { useProjectStore } from "@/lib/store";
import { Models } from "@nuvix/console";
import React, { useCallback, useState } from "react";
import { useTopicStore } from "./store";
import { useToast } from "@nuvix/ui/components";

interface CreateSubscribersProps {
  onClose: () => void;
  isOpen: boolean;
  refetch: () => Promise<void>;
}

export const CreateSubscribers = ({ onClose, isOpen, refetch }: CreateSubscribersProps) => {
  const [targetsById, setTargetsById] = useState<Record<string, Models.Target>>({});
  const { sdk } = useProjectStore((state) => state);
  const { topic } = useTopicStore((state) => state);
  const { addToast } = useToast();

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

  const handleAdd = (targets: Models.Target[]) => {
    const data: Record<string, Models.Target> = {};
    const newData: string[] = [];
    for (const target of targets) {
      data[target.$id] = target;
      if (!topic?.subscribe.includes(target.$id)) {
        newData.push(target.$id);
      }
    }
    setTargetsById(data);
    if (newData.length === 0) {
      addToast("0 subscribers added.");
    } else {
      const doo = newData.map(
        async (id) => await sdk.messaging.createSubscriber(topic?.$id!, "unique()", id),
      );
      Promise.allSettled(doo)
        .then(async () => {
          addToast(`${newData.length} subscribers added.`);
          await refetch();
        })
        .catch((e) => addToast({ message: "Something went wrong", variant: "danger" }));
    }
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={handleDialogOpenChange}
      closeOnEscape={false}
      closeOnInteractOutside={false}
    >
      <Targets
        add={handleAdd}
        sdk={sdk}
        onClose={handleClose}
        groups={targetsById}
        title="Select Subscribers"
      />
    </DialogRoot>
  );
};
