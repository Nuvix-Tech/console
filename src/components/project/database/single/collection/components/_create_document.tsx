import { StepperDrawer } from "@/components/others/stepper";
import { useSteps } from "@chakra-ui/react";
import React from "react";

interface CreateDocumentProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDocument: React.FC<CreateDocumentProps> = ({ isOpen, onClose }) => {
  const steps = [
    {
      title: "Data",
      node: <div>Data</div>,
    },
    {
      title: "Permissions",
      node: <div>Permissions</div>,
    },
  ];

  const value = useSteps({ defaultStep: 0 });

  return (
    <StepperDrawer
      size="lg"
      value={value}
      steps={steps}
      title="Create Document"
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    />
  );
};
