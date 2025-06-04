import { CardBox } from "@/components/others/card";
import { VStack } from "@chakra-ui/react";
import { Button } from "@nuvix/sui/components";
import { Card, IconButton, Text } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React, { useState, useMemo } from "react";
import { Topics } from "./_topics";
import { Targets } from "./_targets";
import { LuPlus, LuX } from "react-icons/lu";
import { useProjectStore } from "@/lib/store";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@/components/cui/popover";
import { DialogRoot } from "@/components/cui/dialog";
import { Models, MessagingProviderType } from "@nuvix/console";

interface SelectTargetsProps {
  type: MessagingProviderType;
}

export const SelectTargets = ({ type }: SelectTargetsProps) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string | boolean>>();

  return (
    <CardBox>
      <div className="space-y-4">
        <TargetsSelector type={type} />
      </div>
    </CardBox>
  );
};

const TargetsSelector = ({ type }: { type: MessagingProviderType }) => {
  const { sdk } = useProjectStore((state) => state);
  const [targetsById, setTargetsById] = useState<Record<string, Models.Target>>({});

  const hasTargets = useMemo(() => Object.keys(targetsById).length > 0, [targetsById]);

  const addTargets = (newTargets: Record<string, Models.Target>) => {
    setTargetsById(newTargets);
  };

  const removeTarget = (targetId: string) => {
    const { [targetId]: _, ...rest } = targetsById;
    setTargetsById(rest);
  };

  const getTotal = (topic: Models.Topic): number => {
    switch (type) {
      case MessagingProviderType.Email:
        return topic.emailTotal;
      case MessagingProviderType.Sms:
        return topic.smsTotal;
      case MessagingProviderType.Push:
        return topic.pushTotal;
      default:
        return 0;
    }
  };

  if (!hasTargets) {
    return (
      <Card
        title="Topics & Targets"
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
          onAddTopics={() => {}}
          sdk={sdk}
          groups={new Map()}
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
              <th className="text-left p-3">Target</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {/* {Object.entries(topicsById).map(([topicId, topic]) => (
              <tr key={topicId} className="border-b">
                <td className="p-3">
                  {topic.name} ({getTotal(topic)} targets)
                </td>
                <td className="p-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeTopic(topicId)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <LuX size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))} */}
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
                      <LuX size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="relative">
        <Button variant="secondary" className="flex items-center gap-2">
          <LuPlus size={16} />
          Add
        </Button>
      </div>
    </div>
  );
};

export const WithDialog = ({ type, onAddTargets, sdk, groups }: PopoverBoxProps) => {
  const [open, setOpen] = useState(false);

  const handleRoleClick = () => {
    setOpen(true);
  };

  return (
    <div className="relative">
      <IconButton variant="secondary" onClick={handleRoleClick} size="m">
        <LuPlus />
      </IconButton>

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

export type PopoverBoxProps = {
  type: MessagingProviderType;
  onAddTopics: (topics: Record<string, Models.Topic>) => void;
  onAddTargets: (targets: Record<string, Models.Target>) => void;
  children?: React.ReactNode;
  groups: Map<string, string>;
  sdk: any;
};

// const PopoverBox = ({
//   type,
//   onAddTopics,
//   onAddTargets,
//   children,
//   sdk,
//   groups,
// }: PopoverBoxProps) => {
//   const [open, setOpen] = useState(false);
//   const [comp, setComp] = useState<React.JSX.Element>();
//   const [popOpen, setPopOpen] = useState(false);

//   const handleRoleClick = (component: React.JSX.Element) => {
//     setPopOpen(false);
//     setComp(component);
//     setOpen(true);
//   };

//   const roles = [
//     {
//       label: "Select Topics",
//       component: (
//         <Topics
//           add={(topics) => onAddTopics({ [topics.$id]: topics })}
//           sdk={sdk}
//           onClose={() => setOpen(false)}
//           groups={groups}
//         />
//       ),
//     },
//     {
//       label: "Select Targets",
//       component: (
//         <Targets
//           add={(targets) => onAddTargets({ [targets.$id]: targets })}
//           sdk={sdk}
//           onClose={() => setOpen(false)}
//           groups={groups}
//         />
//       ),
//     },
//   ];

//   return (
//     <>
//       <PopoverRoot
//         portalled={true}
//         size="xs"
//         open={popOpen}
//         onOpenChange={({ open }) => setPopOpen(open)}
//       >
//         <PopoverTrigger asChild>{children}</PopoverTrigger>
//         <PopoverContent className="!shadow-none border max-w-48">
//           <PopoverArrow />
//           <PopoverBody>
//             <VStack width="full">
//               {roles.map(({ component, label }, index) => (
//                 <Button
//                   key={index}
//                   variant="ghost"
//                   onClick={() => handleRoleClick(component)}
//                   className="w-full justify-start"
//                 >
//                   {label}
//                 </Button>
//               ))}
//             </VStack>
//           </PopoverBody>
//         </PopoverContent>
//       </PopoverRoot>

//       <DialogRoot
//         open={open}
//         onOpenChange={({ open }) => setOpen(open)}
//         closeOnEscape={false}
//         closeOnInteractOutside={false}
//       >
//         {comp}
//       </DialogRoot>
//     </>
//   );
// };
