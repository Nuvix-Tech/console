import React, { useState, useCallback, type ComponentType } from "react";
import { WizardContext } from "@/hooks/useWizard";
import { CreateProject } from "./_project_create";

type WizardComponent = ComponentType<any>;

export const WizardProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [CurrentComponent, setCurrentComponent] = useState<WizardComponent | null>(null);

  const onOpenChange = ({ open }: { open: boolean }) => {
    setOpen(open);
    if (!open) {
      setCurrentComponent(null);
    }
  };

  const openWizard = useCallback((component: WizardComponent) => {
    setCurrentComponent(() => component);
    setOpen(true);
  }, []);

  const contextValue = {
    open,
    setOpen,
    createProject: () => openWizard(CreateProject),
  };

  return (
    <WizardContext.Provider value={contextValue}>
      {children}
      {CurrentComponent && <CurrentComponent open={open} onOpenChange={onOpenChange} />}
    </WizardContext.Provider>
  );
};
