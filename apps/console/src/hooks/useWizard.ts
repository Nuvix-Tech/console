import React from "react";

interface WizardContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createProject: VoidFunction;
}

export const WizardContext = React.createContext<WizardContextProps>({
  open: false,
  setOpen: () => {},
} as unknown as WizardContextProps);

export const useWizard = () => {
  const context = React.use(WizardContext);
  if (context === undefined) throw new Error("useWizard must be wrraped in WizardProvider.");
  return context;
};
