"use client";

import { MouseEventHandler, forwardRef, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@nuvix/sui/components/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@nuvix/sui/components/dialog";
import { Button } from "@chakra-ui/react";

export interface ConfirmationModalProps {
  loading?: boolean;
  visible: boolean;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  confirmLabel?: string;
  confirmLabelLoading?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  disabled?: boolean;
  variant?: React.ComponentProps<typeof Alert>["variant"] | "warning";
  alert?: {
    base?: React.ComponentProps<typeof Alert>;
    title?: string;
    description?: string | React.ReactNode;
  };
}

const ConfirmationModal = forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof Dialog> & ConfirmationModalProps
>(
  (
    {
      title,
      description,
      visible,
      onCancel,
      onConfirm,
      loading: loading_ = false,
      cancelLabel = "Cancel",
      confirmLabel = "Submit",
      confirmLabelLoading,
      alert = undefined,
      children,
      variant = "default",
      disabled,
      ...props
    },
    ref,
  ) => {
    useEffect(() => {
      if (visible) {
        setLoading(false);
      }
    }, [visible]);

    const [loading, setLoading] = useState(false);

    const onSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setLoading(true);
      onConfirm();
    };

    return (
      <Dialog
        open={visible}
        {...props}
        onOpenChange={() => {
          if (visible) {
            onCancel();
          }
        }}
      >
        <DialogContent ref={ref}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {alert && (
            <Alert
              variant={variant as "default" | "destructive"}
              className="border-r-0 border-l-0 rounded-none -mt-px [&_svg]:ml-0.5 mb-0"
              {...alert?.base}
            >
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          )}
          {children && (
            <>
              <div className="py-3">{children}</div>
            </>
          )}
          <DialogFooter>
            <Button
              size="sm"
              type="button"
              variant="subtle"
              disabled={loading}
              onClick={() => onCancel()}
            >
              {cancelLabel}
            </Button>

            <Button
              size="sm"
              variant="solid"
              colorPalette={
                variant === "destructive" ? "red" : variant === "warning" ? "yellow" : "bg"
              }
              type="submit"
              loading={loading}
              disabled={loading || disabled}
              onClick={onSubmit}
              className="truncate"
            >
              {loading ? confirmLabelLoading : confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

ConfirmationModal.displayName = "ConfirmationModal";

export default ConfirmationModal;
