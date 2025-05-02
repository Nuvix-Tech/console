"use client";

import * as Dialog from "@radix-ui/react-dialog";
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
  > { }

interface CustomProps {
  id?: String | undefined;
  disabled?: boolean;
  className?: String;
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
  console.log(visible, "YES IT IS?")
  const footerContent = customFooter ? (
    customFooter
  ) : (
    <div className={styles["sbui-sidepanel-footer"]}>
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
    </div>
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
    <Dialog.Root open={open} onOpenChange={handleOpenChange} defaultOpen={defaultOpen}>
      {triggerElement && (
        <Dialog.Trigger asChild className={styles["sbui-sidepanel__trigger"]}>
          {triggerElement}
        </Dialog.Trigger>
      )}

      <Dialog.Portal>
        <Dialog.Overlay className={styles["sbui-sidepanel-overlay"]} />
        <Dialog.Content
          className={classNames(
            styles["sbui-sidepanel"],
            styles[`sbui-sidepanel--${size}`],
            styles[`sbui-sidepanel--${align}`],
            className,
          )}
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
          {header && <header className={styles["sbui-sidepanel-header"]}>{header}</header>}
          <div className={styles["sbui-sidepanel-content"]}>{children}</div>
          {!hideFooter && footerContent}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export function Separator() {
  return <div className={styles["sbui-sidepanel-separator"]}></div>;
}

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
