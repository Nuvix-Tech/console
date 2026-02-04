"use client";
import React, { createContext, useContext, useState, type ReactNode } from "react";
import { ConfirmDialog, type ConfirmDialogProps } from "./ConfirmDialog";

interface ConfirmContextType {
  confirm: (
    props: Omit<ConfirmDialogProps, "isOpen" | "onConfirm" | "onClose">,
  ) => Promise<boolean | string>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx.confirm;
};

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<{
    props: Omit<ConfirmDialogProps, "isOpen" | "onConfirm" | "onClose">;
    resolve: (result: boolean) => void;
  } | null>(null);

  const confirm = (props: Omit<ConfirmDialogProps, "isOpen" | "onConfirm" | "onClose">) => {
    return new Promise<boolean>((resolve) => {
      setState({ props, resolve });
    });
  };

  const handleConfirm = async (result: boolean) => {
    if (state) {
      state.resolve(result);
      setState(null);
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <ConfirmDialog
          {...state.props}
          isOpen={true}
          onConfirm={handleConfirm}
          onClose={() => setState(null)}
        />
      )}
    </ConfirmContext.Provider>
  );
};
