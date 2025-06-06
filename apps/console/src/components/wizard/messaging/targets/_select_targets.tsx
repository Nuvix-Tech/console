import { Button } from "@nuvix/sui/components";
import { Card, IconButton, Text } from "@nuvix/ui/components";
import React, { useState, useMemo, useEffect } from "react";
import { LuPlus, LuX } from "react-icons/lu";
import { useProjectStore } from "@/lib/store";
import { DialogRoot } from "@/components/cui/dialog";
import { Models, MessagingProviderType, Query } from "@nuvix/console";
import { ProjectSdk } from "@/lib/sdk";
import { Targets } from "./_targets";

export const TargetsSelector = ({
  type,
  values,
  onSave,
}: { type: MessagingProviderType; values: string[]; onSave: (values: string[]) => void }) => {
  const { sdk } = useProjectStore((state) => state);
  const groups: Record<string, Models.Target> = {};
  const [targetsById, setTargetsById] = useState<Record<string, Models.Target>>({});

  const hasTargets = useMemo(() => Object.keys(targetsById).length > 0, [targetsById]);

  // Fetch targets by IDs and set initial targetsById value
  useEffect(() => {
    const fetchTargets = async () => {
      if (values.length === 0) return;
      try {
        const targetsRecord: Record<string, Models.Target> = {};
        const target = await sdk.users.list([Query.equal("targets.$id", values)]);
        if (!target.total) return;
        // for (const _target of target.targets) {
        //   targetsRecord[_target.$id] = _target;
        // }
        setTargetsById(targetsRecord);
      } catch (error) {
        // TODO: Handle error appropriately
      }
    };

    fetchTargets();
  }, [values, sdk]);

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
        <WithDialog
          type={type}
          onAddTargets={addTargets}
          sdk={sdk}
          groups={groups}
          trigger={IconButton}
          args={{
            children: <LuPlus />,
          }}
        />
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
                  trigger={Button}
                  args={{
                    children: (
                      <>
                        <LuPlus /> Add
                      </>
                    ),
                    size: "sm",
                  }}
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
                      <LuX size={18} />
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

export const WithDialog = ({
  type,
  onAddTargets,
  sdk,
  groups,
  trigger: Trigger,
  args,
}: DialogBoxProps) => {
  const [open, setOpen] = useState(false);

  const handleRoleClick = () => {
    setOpen(true);
  };

  return (
    <div className="relative">
      <Trigger variant="secondary" onClick={handleRoleClick} size="m" {...args} />

      <DialogRoot
        open={open}
        onOpenChange={({ open }) => setOpen(open)}
        closeOnEscape={false}
        closeOnInteractOutside={false}
      >
        <Targets
          add={(targets) => onAddTargets({ [targets.$id]: targets })}
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
  trigger: React.ElementType;
  args?: any;
};
