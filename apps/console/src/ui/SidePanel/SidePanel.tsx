"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@nuvix/sui/components/sheet";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { Button } from "@nuvix/ui/components";
import styles from "./SidePanel.module.css";
import classNames from "classnames";

export type SidePanelProps = RadixProps & CustomProps;

interface RadixProps
  extends Dialog.DialogProps,
    Pick<
      Dialog.DialogContentProps,
      | "onOpenAutoFocus"
      | "onCloseAutoFocus"
      | "onEscapeKeyDown"
      | "onPointerDownOutside"
      | "onInteractOutside"
    > {}

interface CustomProps {
  id?: String | undefined;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  header?: string | React.ReactNode;
  visible: boolean;
  size?: "medium" | "large" | "xlarge" | "xxlarge" | "xxxlarge" | "xxxxlarge";
  loading?: boolean;
  align?: "right" | "left";
  hideFooter?: boolean;
  customFooter?: React.ReactNode;
  onCancel?: () => void;
  cancelText?: String;
  onConfirm?: () => void;
  confirmText?: String;
  triggerElement?: React.ReactNode;
  tooltip?: string;
}

const SidePanel = ({
  id,
  disabled,
  className,
  children,
  header,
  visible,
  open,
  size = "medium",
  loading,
  align = "right",
  hideFooter = false,
  customFooter = undefined,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  triggerElement,
  defaultOpen,
  tooltip,
  ...props
}: SidePanelProps) => {
  const footerContent = customFooter ? (
    <SheetFooter>
      <div className="w-full relative">{customFooter}</div>
    </SheetFooter>
  ) : (
    <SheetFooter>
      <div>
        <Button
          disabled={loading}
          variant="secondary"
          onClick={() => (onCancel ? onCancel() : null)}
        >
          {cancelText}
        </Button>
      </div>
      {onConfirm !== undefined && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block">
              <Button
                variant="primary"
                disabled={disabled || loading}
                loading={loading}
                onClick={() => (onConfirm ? onConfirm() : null)}
              >
                {confirmText}
              </Button>
            </span>
          </TooltipTrigger>
          {tooltip !== undefined && <TooltipContent side="bottom">{tooltip}</TooltipContent>}
        </Tooltip>
      )}
    </SheetFooter>
  );

  function handleOpenChange(open: boolean) {
    if (visible !== undefined && !open) {
      // controlled component behaviour
      if (onCancel) onCancel();
    } else {
      // un-controlled component behaviour
      // setOpen(open)
    }
  }

  open = open || visible;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange} defaultOpen={defaultOpen}>
      {triggerElement && (
        <SheetTrigger asChild className={styles["sbui-sidepanel__trigger"]}>
          {triggerElement}
        </SheetTrigger>
      )}

      <SheetContent
        className={classNames(getSize(size), className, "sm:max-w-[inherit] h-full")}
        onOpenAutoFocus={props.onOpenAutoFocus}
        onCloseAutoFocus={props.onCloseAutoFocus}
        onEscapeKeyDown={props.onEscapeKeyDown}
        onPointerDownOutside={props.onPointerDownOutside}
        onInteractOutside={(event) => {
          const isToast = (event.target as Element)?.closest("#toast");
          if (isToast) event.preventDefault();
          if (props.onInteractOutside) props.onInteractOutside(event);
        }}
      >
        {header && <SheetHeader className="flex-row">{header}</SheetHeader>}
        <div className="h-full overflow-y-auto">{children}</div>
        {!hideFooter && footerContent}
      </SheetContent>
    </Sheet>
  );
};

export function Separator() {
  return <div className={"h-px w-full bg-[var(--neutral-border-medium)]"}></div>;
}

const getSize = (size: CustomProps["size"]) => {
  switch (size) {
    case "medium":
      return "sm:w-xl";
    case "large":
      return "sm:w-2xl";
    case "xlarge":
      return "sm:w-3xl";
    case "xxlarge":
      return "sm:w-4xl";
    case "xxxlarge":
      return "sm:w-5xl";
    case "xxxxlarge":
      return "sm:w-6xl";
    default:
      return "w-full";
  }
};

export function Content({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={classNames(styles["sbui-sidepanel-content"], className)}>{children}</div>;
}

SidePanel.Content = Content;
SidePanel.Separator = Separator;
export default SidePanel;
