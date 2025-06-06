"use client";
import { DialogRoot } from "@/components/cui/dialog";
import { Targets } from "@/components/wizard/messaging/targets";
import { useProjectStore } from "@/lib/store";
import { ID, Models } from "@nuvix/console";
import React, { useCallback, useEffect, useState } from "react";
import { useTopicStore } from "./store";
import { useToast } from "@nuvix/ui/components";

interface CreateSubscribersProps {
  onClose: () => void;
  isOpen: boolean;
  refetch: () => Promise<void>;
  subscribers: Models.Subscriber[];
}

export const CreateSubscribers = ({
  onClose,
  isOpen,
  refetch,
  subscribers,
}: CreateSubscribersProps) => {
  const [targetsById, setTargetsById] = useState<Record<string, Models.Target>>({});
  const [subscribersByTargetId, setSubscribersByTargetId] = useState<
    Record<string, Models.Subscriber>
  >({});
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

  useEffect(() => {
    let _targetsById: Record<string, Models.Target> = {},
      _subscribersByTargetId: Record<string, Models.Subscriber> = {};
    for (const subscriber of subscribers) {
      const { target } = subscriber;
      _targetsById[target.$id] = target;
      _subscribersByTargetId[target.$id] = subscriber;
    }
    setTargetsById(_targetsById);
    setSubscribersByTargetId(_subscribersByTargetId);
  }, [subscribers]);

  const handleAdd = (targets: Models.Target[]) => {
    let _targetsById: any = {};
    for (const t of targets) {
      _targetsById[t.$id] = t;
    }
    setTargetsById(_targetsById);
    const targetIds = Object.keys(_targetsById).filter(
      (targetId) => !(targetId in subscribersByTargetId),
    );
    const promises = targetIds.map(async (targetId) => {
      const subscriber = await sdk.messaging.createSubscriber(topic?.$id!, ID.unique(), targetId);
      subscribersByTargetId[targetId] = subscriber;
    });

    Promise.all(promises)
      .then(async () => {
        addToast(`Added ${targetIds.length} subscriber${targetIds.length > 1 ? "s" : ""} to topic`);
        await refetch();
      })
      .catch((e) => {
        addToast({ message: e.message ?? "Something went wrong", variant: "danger" });
      });
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
