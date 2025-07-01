import { Card, IconButton, Text, Button } from "@nuvix/ui/components";
import React, { useState, useMemo, useEffect } from "react";
import { useProjectStore } from "@/lib/store";
import { DialogRoot } from "@nuvix/cui/dialog";
import { Models, MessagingProviderType } from "@nuvix/console";
import { ProjectSdk } from "@/lib/sdk";
import { Targets } from "./_targets";
import { PlusIcon, XIcon } from "lucide-react";

export const TargetsSelector = ({
  type,
  onSave,
}: { type: MessagingProviderType; onSave: (values: string[]) => void }) => {
  const { sdk } = useProjectStore((state) => state);
  const [targetsById, setTargetsById] = useState<Record<string, Models.Target>>({});

  const hasTargets = useMemo(() => Object.keys(targetsById).length > 0, [targetsById]);

  const addTargets = (newTargets: Record<string, Models.Target>) => {
    setTargetsById((prev) => ({ ...prev, ...newTargets }));
    const allTargetIds = Object.keys({ ...targetsById, ...newTargets });
    onSave(allTargetIds);
  };

  const removeTarget = (targetId: string) => {
    setTargetsById((prev) => {
      const { [targetId]: removed, ...remaining } = prev;
      return remaining;
    });
    setTargetsById((prev) => {
      const newValues = Object.keys(prev);
      onSave(newValues);
      return prev;
    });
  };

  // Update parent whenever targets change
  useEffect(() => {
    const targetIds = Object.keys(targetsById);
    onSave(targetIds);
  }, [targetsById]);

  if (!hasTargets) {
    return (
      <Card
        title="Message Recipients"
        minHeight="160"
        radius="l-4"
        center
        fillWidth
        direction="column"
        gap="12"
      >
        <WithDialog type={type} onAddTargets={addTargets} sdk={sdk} groups={targetsById} />
        <Text variant="body-default-s" onBackground="neutral-medium">
          No recipients selected. Click the button above to add recipients for your message.
        </Text>
      </Card>
    );
  }

  return (
    <TargetsSelectorList
      sdk={sdk}
      type={type}
      targets={targetsById}
      addTargets={addTargets}
      removeTarget={removeTarget}
    />
  );
};

export const WithDialog = ({ type, onAddTargets, sdk, groups, showButton }: DialogBoxProps) => {
  const Trigger = showButton ? Button : IconButton;
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleAddTargets = (targets: Models.Target[]) => {
    const newTargetsById: Record<string, Models.Target> = {};
    targets.forEach((target) => {
      newTargetsById[target.$id] = target;
    });
    onAddTargets(newTargetsById);
    setOpen(false);
  };

  return (
    <>
      <Trigger
        variant="secondary"
        onClick={handleOpenDialog}
        size="s"
        type="button"
        className="items-center"
        title={showButton ? "Add recipients" : "Add"}
      >
        <PlusIcon size={14} />
        {showButton && <span className="ml-1">Add</span>}
      </Trigger>

      <DialogRoot
        open={open}
        onOpenChange={({ open }) => setOpen(open)}
        closeOnEscape={true}
        closeOnInteractOutside={true}
      >
        <Targets
          add={handleAddTargets}
          sdk={sdk}
          onClose={() => setOpen(false)}
          groups={groups}
          type={type}
        />
      </DialogRoot>
    </>
  );
};

export const TargetsSelectorList = ({
  type,
  sdk,
  targets,
  addTargets,
  removeTarget,
  canAdd = true,
}: TargetsSelectorList) => {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium">
                Recipients ({Object.keys(targets).length})
              </th>
              {canAdd && (
                <th className="w-16 pr-2">
                  <WithDialog
                    onAddTargets={addTargets}
                    type={type}
                    sdk={sdk}
                    groups={targets}
                    showButton
                  />
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {Object.entries(targets).map(([targetId, target]) => (
              <tr key={targetId} className="border-b last:border-b-0">
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{target.name || target.identifier}</span>
                    {target.name && target.identifier && target.name !== target.identifier && (
                      <span className="text-sm text-gray-500">{target.identifier}</span>
                    )}
                  </div>
                </td>
                {canAdd && (
                  <td className="p-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeTarget(targetId)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
                        title="Remove recipient"
                      >
                        <XIcon size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

type TargetsSelectorList = {
  targets: Record<string, Models.Target>;
  addTargets: DialogBoxProps["onAddTargets"];
  removeTarget: (targetId: string) => void;
  canAdd?: boolean;
} & Pick<DialogBoxProps, "sdk" | "type">;

export type DialogBoxProps = {
  type: MessagingProviderType;
  onAddTargets: (targets: Record<string, Models.Target>) => void;
  children?: React.ReactNode;
  groups: Record<string, Models.Target>;
  sdk: ProjectSdk;
  showButton?: boolean;
};
