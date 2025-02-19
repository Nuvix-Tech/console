"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Dialog, Flex, Toast } from ".";

interface ConfirmDialogProps {
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

const ConfirmDialog: React.FC<ConfirmDialogProps> =
  ({ title, description, node, onClose, cancleText, confirmText, cancleVariant = "secondary", confirmVariant = "primary" }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(
      <Dialog
        isOpen
        title={title}
        description={description}
        children={node}
        onClose={onClose}
        footer={
          <>
            <Button size="m" variant={cancleVariant}>
              {cancleText ?? 'Cancle'}
            </Button>
            <Button size="m" variant={confirmVariant}>
              {confirmText ?? 'Ok'}
            </Button>
          </>
        }
      />,
      document.body,
    );
  };

ConfirmDialog.displayName = "ConfirmDialog";
export { ConfirmDialog };
