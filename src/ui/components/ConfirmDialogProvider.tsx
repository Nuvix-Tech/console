"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button } from "@chakra-ui/react";

export interface ConfirmDialogProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  element?: React.ReactNode;
  onClose?: VoidFunction;
  cancle?: {
    text?: string;
    variant?: "danger" | "primary" | "secondary" | "tertiary";
  };
  confirm?: {
    text?: string;
    variant?: "danger" | "primary" | "secondary" | "tertiary";
  };
  button?: {
    cancle?: React.ComponentProps<typeof Button>;
    ok?: React.ComponentProps<typeof Button>;
  }
}

interface ConfirmContextType {
  confirm: (props: ConfirmDialogProps) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = (): ((props: ConfirmDialogProps) => Promise<boolean>) => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context.confirm;
};

interface ConfirmProviderProps {
  children: ReactNode;
}

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({ children }) => {
  const [confirmState, setConfirmState] = useState<
    | (ConfirmDialogProps & {
      resolve: (result: boolean) => void;
    })
    | null
  >(null);

  const confirm = (props: ConfirmDialogProps): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ ...props, resolve });
    });
  };

  const handleConfirm = (result: boolean) => {
    if (confirmState) {
      confirmState.resolve(result);
      setConfirmState(null);
    }
  };

  const modal = (
    <ConfirmDialog
      isOpen={!!confirmState}
      onClose={() => {
          confirmState?.onClose?.();
          setConfirmState(null);
      }}
      title={confirmState?.title}
      description={confirmState?.description}
      handleConfirm={handleConfirm}
      node={confirmState?.element}
      cancleText={confirmState?.cancle?.text}
      cancleVariant={confirmState?.cancle?.variant}
      confirmText={confirmState?.confirm?.text}
      confirmVariant={confirmState?.confirm?.variant}
    />
  );

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {modal}
    </ConfirmContext.Provider>
  );
};
