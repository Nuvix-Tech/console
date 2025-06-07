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
      closeOnInteractOutside={false}
      unmountOnExit
      modal
      size={"xs"}
      placement={"center"}
    >
      <Portal disabled={!portalled}>
        <Dialog.Backdrop />
        <Dialog.Positioner className="bg-[var(--backdrop)]" zIndex={10000}>
          <Dialog.Content
            shadow={"none"}
            border={"1px"}
            borderStyle={"solid"}
            borderColor={"border"}
          >
            <Dialog.Header flexDirection={"column"} gap={0.5}>
              <Dialog.Title>{title}</Dialog.Title>
              {description && <Dialog.Description>{description}</Dialog.Description>}
            </Dialog.Header>
            {node && <Dialog.Body>{node}</Dialog.Body>}
            <Dialog.Footer>
              <Button
                onClick={() => {
                  handleConfirm(false);
                }}
                variant="secondary"
                size="s"
                {...button?.cancel}
              >
                {" "}
                {cancelText ?? "Cancel"}
              </Button>
              <Button
                onClick={() => {
                  handleConfirm(true);
                }}
                size="s"
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
