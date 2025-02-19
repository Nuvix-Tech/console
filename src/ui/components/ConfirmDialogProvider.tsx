"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

interface ConfirmDialogProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  element?: React.ReactNode;
  cancle?: {
    text?: string;
    variant?: "danger" | "primary" | "secondary" | "tertiary"
  },
  confirm?: {
    text?: string;
    variant?: "danger" | "primary" | "secondary" | "tertiary"
  }
}

interface ConfirmContextType {
  confirm: (props: ConfirmDialogProps) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = (): ((props: ConfirmDialogProps) => Promise<boolean>) => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context.confirm;
};

interface ConfirmProviderProps {
  children: ReactNode;
}

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({ children }) => {
  const [confirmState, setConfirmState] = useState<ConfirmDialogProps & {
    resolve: (result: boolean) => void;
  } | null>(null);

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

  const modal = confirmState
    ? <ConfirmDialog
      onClose={() => handleConfirm(false)}
      title={confirmState.title}
      description={confirmState.description}
      handleConfirm={handleConfirm}
      node={confirmState.element}
      cancleText={confirmState.cancle?.text}
      cancleVariant={confirmState.cancle?.variant}
      confirmText={confirmState.confirm?.text}
      confirmVariant={confirmState.confirm?.variant}
    />
    : null;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {modal}
    </ConfirmContext.Provider>
  );
};