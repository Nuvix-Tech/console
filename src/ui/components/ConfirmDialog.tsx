"use client";
import type React from "react";
import { Button, ConfirmDialogProps, Dialog } from ".";

interface ConfirmProps extends Pick<ConfirmDialogProps, "button"> {
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

const ConfirmDialog: React.FC<ConfirmProps> = ({
  isOpen,
  title,
  description,
  node,
  onClose,
  cancleText,
  confirmText,
  handleConfirm,
  button,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button
            onClick={() => {
              handleConfirm(false);
            }}
            {...button?.cancle}
          >
            {" "}
            {cancleText ?? "Cancle"}
          </Button>
          <Button
            onClick={() => {
              handleConfirm(true);
            }}
            {...button?.ok}
          >
            {" "}
            {confirmText ?? "Continue"}
          </Button>
        </>
      }
    >
      {node}
    </Dialog>
  );
};

ConfirmDialog.displayName = "ConfirmDialog";
export { ConfirmDialog };
