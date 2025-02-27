"use client";
import type React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button, ConfirmDialogProps } from ".";

interface ConfirmProps extends Pick<ConfirmDialogProps, 'button'> {
  isOpen: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  node?: React.ReactNode;
  cancleText?: string;
  cancleVariant?: "danger" | "primary" | "secondary" | "tertiary";
  confirmText?: string;
  confirmVariant?: "danger" | "primary" | "secondary" | "tertiary";
  handleConfirm: (value: boolean) => void;
  onClose: (o: boolean) => void;
}

const ConfirmDialog: React.FC<ConfirmProps> = ({
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
  button,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-1/2">
        <AlertDialogHeader>
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {description && <AlertDialogDescription>
            {description}
          </AlertDialogDescription>}
        </AlertDialogHeader>
        {node}
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              handleConfirm(false);
            }}
            {...button?.cancle}
          >
            {cancleText ?? "Cancle"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleConfirm(true);
            }}
            {...button?.ok}
          >
            {confirmText ?? 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

ConfirmDialog.displayName = "ConfirmDialog";
export { ConfirmDialog };
