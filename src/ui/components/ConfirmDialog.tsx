"use client";
import type React from "react";
import { Button, Dialog } from ".";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  node?: React.ReactNode;
  cancleText?: string;
  cancleVariant?: "danger" | "primary" | "secondary" | "tertiary";
  confirmText?: string;
  confirmVariant?: "danger" | "primary" | "secondary" | "tertiary";
  handleConfirm: (value: boolean) => void;
  onClose: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  node,
  onClose,
  cancleText,
  confirmText,
  cancleVariant = "tertiary",
  confirmVariant = "primary",
  handleConfirm,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      title={title}
      description={description}
      children={node}
      maxWidth={28}
      onClose={onClose}
      footer={
        <>
          <Button
            size="m"
            variant={cancleVariant}
            onClick={() => {
              handleConfirm(false);
            }}
          >
            {cancleText ?? "Cancle"}
          </Button>
          <Button
            size="m"
            variant={confirmVariant}
            onClick={() => {
              handleConfirm(true);
            }}
          >
            {confirmText ?? "Ok"}
          </Button>
        </>
      }
    />
  );
};

ConfirmDialog.displayName = "ConfirmDialog";
export { ConfirmDialog };
