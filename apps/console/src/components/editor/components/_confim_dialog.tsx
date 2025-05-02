"use client";

import { MouseEventHandler, forwardRef, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@nuvix/sui/components/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@nuvix/sui/components/dialog";
import { cn } from "@nuvix/sui/lib/utils";
import { Button } from "@nuvix/sui/components/button";
import { Separator } from "@nuvix/sui/components/separator";

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
        <DialogContent ref={ref} className="p-0 gap-0 pb-5 !block">
          <DialogHeader className={cn("border-b px-4 py-2")}>
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
              {/* <DialogSection padding={'small'}>{children}</DialogSection>
                            <DialogSectionSeparator /> */}
              <div className="px-5 py-5">{children}</div>
              <Separator />
            </>
          )}
          <div className="flex gap-2 px-5 pt-5 justify-end">
            <Button
              size="sm"
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => onCancel()}
            >
              {cancelLabel}
            </Button>

            <Button
              block
              size="sm"
              // @ts-ignore
              variant={
                variant === "destructive"
                  ? "destructive"
                  : variant === "warning"
                    ? "warning"
                    : "default"
              }
              htmlType="submit"
              loading={loading}
              disabled={loading || disabled}
              onClick={onSubmit}
              className="truncate"
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

ConfirmationModal.displayName = "ConfirmationModal";

export default ConfirmationModal;
