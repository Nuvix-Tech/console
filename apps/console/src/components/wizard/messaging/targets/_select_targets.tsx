import { CardBox } from "@/components/others/card";
import { InputField, InputTextareaField } from "@/components/others/forms";
import { VStack } from "@chakra-ui/react";
import { Button } from "@nuvix/sui/components";
import { Card, IconButton, Text } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React, { useState } from "react";
import { Topics } from "./_topics";
import { Targets } from "./_targets";
import { LuPlus } from "react-icons/lu";
import { useProjectStore } from "@/lib/store";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@/components/cui/popover";
import { DialogRoot } from "@/components/cui/dialog";

export const SelectTargets = () => {
  const { values, setFieldValue } = useFormikContext<Record<string, string | boolean>>();

  return (
    <>
      <CardBox>
        <div className="space-y-4">
          <TargetsSelector />
        </div>
      </CardBox>
    </>
  );
};

const TargetsSelector = () => {
  const { sdk } = useProjectStore((state) => state);

  return (
    <>
      <Card
        title="Permissions"
        minHeight="160"
        radius="l-4"
        center
        fillWidth
        direction="column"
        gap="12"
      >
        <PopoverBox addRole={() => {}} sdk={sdk} groups={new Map()}>
          <IconButton variant="secondary" size="m">
            <LuPlus />
          </IconButton>
        </PopoverBox>
        <Text variant="body-default-s" onBackground="neutral-medium">
          No roles added yet. Click "+" to begin.
        </Text>
      </Card>
    </>
  );
};

export type PopoverBoxProps = {
  addRole: (role: string) => void;
  children: React.ReactNode;
  groups: Map<string, any>;
} & { sdk: any };

const PopoverBox = ({ addRole, children, sdk, groups }: PopoverBoxProps) => {
  const [open, setOpen] = useState(false);
  const [comp, setComp] = useState<React.JSX.Element>();

  const handleRoleClick = (component: React.JSX.Element) => {
    setComp(component);
    setOpen(true);
  };

  const roles = [
    {
      label: "Select Topics",
      component: (
        <Topics addRole={addRole} sdk={sdk} onClose={() => setOpen(false)} groups={groups} />
      ),
    },
    {
      label: "Select Targets",
      component: (
        <Targets addRole={addRole} sdk={sdk} onClose={() => setOpen(false)} groups={groups} />
      ),
    },
  ];

  return (
    <>
      <PopoverRoot portalled={true} size="xs">
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="!shadow-none border max-w-48">
          <PopoverArrow />
          <PopoverBody>
            <VStack width="full">
              {roles.map(({ component, label }, _) => (
                <Button
                  variant="ghost"
                  onClick={() => handleRoleClick(component)}
                  className="w-full justify-start"
                >
                  {label}
                </Button>
              ))}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>

      <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
        {comp}
      </DialogRoot>
    </>
  );
};
