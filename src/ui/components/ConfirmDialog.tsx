"use client";
import type React from "react";
import { Button, DialogDescription } from "@chakra-ui/react"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/cui/dialog"
import { ConfirmDialogProps } from ".";

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
    <DialogRoot role="alertdialog" open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>
            {description}
          </DialogDescription>}
        </DialogHeader>
        {node ? <DialogBody>
          {node}
        </DialogBody> : null}
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline"
              onClick={() => {
                handleConfirm(false);
              }}
              {...button?.cancle}
            >
              {cancleText ?? "Cancle"}
            </Button>
          </DialogActionTrigger>
          <Button onClick={() => {
            handleConfirm(true);
          }} {...button?.ok}>
            {confirmText ?? 'Continue'}
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

ConfirmDialog.displayName = "ConfirmDialog";
export { ConfirmDialog };
