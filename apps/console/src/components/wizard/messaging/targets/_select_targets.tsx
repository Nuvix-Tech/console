import { Card, IconButton, Text, Button } from "@nuvix/ui/components";
import React, { useState, useMemo, useEffect } from "react";
import { useProjectStore } from "@/lib/store";
import { DialogRoot } from "@/components/cui/dialog";
import { Models, MessagingProviderType, Query } from "@nuvix/console";
import { ProjectSdk } from "@/lib/sdk";
import { Targets } from "./_targets";
import { PlusIcon, XIcon } from "lucide-react";

export const TargetsSelector = ({
  type,
  onSave,
}: { type: MessagingProviderType; onSave: (values: string[]) => void }) => {
  const { sdk } = useProjectStore((state) => state);
  const groups: Record<string, Models.Target> = {};
  const [targetsById, setTargetsById] = useState<Record<string, Models.Target>>({});

  const hasTargets = useMemo(() => Object.keys(targetsById).length > 0, [targetsById]);

  const addTargets = (newTargets: Record<string, Models.Target>) => {
    setTargetsById(newTargets);
    const newValues = Object.keys(newTargets);
    if (newValues.length > 0) {
      onSave(newValues);
    }
  };

  const removeTarget = (targetId: string) => {
    const newTargetsById = { ...targetsById };
    delete newTargetsById[targetId];
    setTargetsById(newTargetsById);
    const newValues = Object.keys(newTargetsById);
    if (newValues.length > 0) {
      onSave(newValues);
    }
  };

  if (!hasTargets) {
    return (
      <Card
        title="Targets"
        minHeight="160"
        radius="l-4"
        center
        fillWidth
        direction="column"
        gap="12"
      >
        <WithDialog type={type} onAddTargets={addTargets} sdk={sdk} groups={groups} />
        <Text variant="body-default-s" onBackground="neutral-medium">
          Select targets to get started
        </Text>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Targets</th>
              <th className="w-10 pr-2">
                <WithDialog
                  type={type}
                  onAddTargets={addTargets}
                  sdk={sdk}
                  groups={groups}
                  showButton
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(targetsById).map(([targetId, target]) => (
              <tr key={targetId} className="border-b">
                <td className="p-3">{target.name || target.identifier}</td>
                <td className="p-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeTarget(targetId)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <XIcon size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const WithDialog = ({ type, onAddTargets, sdk, groups, showButton }: DialogBoxProps) => {
  const Trigger = showButton ? Button : IconButton;
  const [open, setOpen] = useState(false);

  const handleRoleClick = () => {
    setOpen(true);
  };

  const handleOnAdd = (targets: Models.Target[]) => {
    const newData: Record<string, Models.Target> = {};
    for (const target of targets) {
      newData[target.$id] = target;
    }
    onAddTargets(newData);
  };

  return (
    <div className="relative">
      <Trigger
        variant="secondary"
        onClick={handleRoleClick}
        size="s"
        type="button"
        className="items-center"
      >
        <PlusIcon size={"14px"} /> {showButton && "Add"}
      </Trigger>

      <DialogRoot
        open={open}
        onOpenChange={({ open }) => setOpen(open)}
        closeOnEscape={false}
        closeOnInteractOutside={false}
      >
        <Targets
          add={handleOnAdd}
          sdk={sdk}
          onClose={() => setOpen(false)}
          groups={groups}
          type={type}
        />
      </DialogRoot>
    </div>
  );
};

export type DialogBoxProps = {
  type: MessagingProviderType;
  onAddTargets: (targets: Record<string, Models.Target>) => void;
  children?: React.ReactNode;
  groups: Record<string, Models.Target>;
  sdk: ProjectSdk;
  showButton?: boolean;
};
