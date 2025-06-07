"use client";
import type React from "react";
import { Button, ConfirmDialogProps } from ".";
import { Dialog, Portal } from "@chakra-ui/react";

interface ConfirmProps extends Pick<ConfirmDialogProps, "button"> {
  isOpen: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  node?: React.ReactNode;
  cancelText?: string;
  cancelVariant?: "danger" | "primary" | "secondary" | "tertiary";
  confirmText?: string;
  confirmVariant?: "danger" | "primary" | "secondary" | "tertiary";
  handleConfirm: (value: boolean) => void;
  onClose: ({ open }: { open: boolean }) => void;
  portalled?: boolean;
}

const ConfirmDialog: React.FC<ConfirmProps> = ({
  isOpen,
  title,
  description,
  node,
  onClose,
  cancelText,
  portalled = true,
  confirmText,
  handleConfirm,
  button,
}) => {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onClose}
      closeOnEscape
      closeOnInteractOutside
      unmountOnExit
      modal
    >
      <Portal disabled={!portalled}>
        <Dialog.Backdrop />
        <Dialog.Positioner className="bg-[var(--backdrop)]" zIndex={10000}>
          <Dialog.Content asChild={false}>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
              {description && <Dialog.Description>{description}</Dialog.Description>}
            </Dialog.Header>
            <Dialog.Body>
              {node}
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                onClick={() => {
                  handleConfirm(false);
                }}
                variant="secondary"
                {...button?.cancel}
              >
                {" "}
                {cancelText ?? "Cancel"}
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
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

ConfirmDialog.displayName = "ConfirmDialog";
export { ConfirmDialog };
