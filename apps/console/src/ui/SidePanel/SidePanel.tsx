"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
} from "@nuvix/sui/components/sheet";
import { DialogProps, DialogContentProps } from "@nuvix/sui/components/dialog";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";
import { Button } from "@nuvix/ui/components";
import styles from "./SidePanel.module.css";
import classNames from "classnames";
import { Form, FormikConfigs, FormikProps } from "@/components/others/forms";
import { FormikValues } from "formik";
import { VisuallyHidden } from "@chakra-ui/react";

export type SidePanelProps = RadixProps & CustomProps;

interface RadixProps
  extends DialogProps,
    Pick<
      DialogContentProps,
      | "onOpenAutoFocus"
      | "onCloseAutoFocus"
      | "onEscapeKeyDown"
      | "onPointerDownOutside"
      | "onInteractOutside"
    > {}

interface CustomProps<T extends FormikValues = any> {
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
  customConfirm?: React.ReactNode;
  triggerElement?: React.ReactNode;
  tooltip?: string;
  form?: FormikConfigs<T, {}> | FormikProps<T>;
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
  customConfirm,
  tooltip,
  form,
  ...props
}: SidePanelProps) => {
  const footerContent = (
    <SheetFooter className="p-0 border-t">
      {customFooter ? (
        <div className="w-full relative">{customFooter}</div>
      ) : (
        <div className="flex items-center justify-end py-2 px-4 gap-4">
          <Button
            disabled={loading}
            size="s"
            variant="secondary"
            onClick={() => (onCancel ? onCancel() : null)}
          >
            {cancelText}
          </Button>
          {onConfirm !== undefined && !customConfirm && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  <Button
                    variant="primary"
                    disabled={disabled || loading}
                    loading={loading}
                    size="s"
                    onClick={() => (onConfirm ? onConfirm() : null)}
                  >
                    {confirmText}
                  </Button>
                </span>
              </TooltipTrigger>
              {tooltip !== undefined && <TooltipContent side="bottom">{tooltip}</TooltipContent>}
            </Tooltip>
          )}
          {customConfirm}
        </div>
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
        <SheetTrigger asChild className={styles["nxui-sidepanel__trigger"]}>
          {triggerElement}
        </SheetTrigger>
      )}

      <SheetContent
        className={classNames(getSize(size), className, "sm:max-w-[inherit] h-full gap-0")}
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
        <VisuallyHidden>
          <SheetTitle />
        </VisuallyHidden>
        <Wrrapper form={form}>
          {header && <SheetHeader className="flex-row border-b w-full block">{header}</SheetHeader>}
          <div className="h-full overflow-y-auto">{children}</div>
          {!hideFooter && footerContent}
        </Wrrapper>
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

function Wrrapper({ form, children }: { form?: any; children: any }) {
  return form ? (
    <Form {...form} className="h-[calc(100vh-120px)]">
      {children}
    </Form>
  ) : (
    children
  );
}

export function Content({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={classNames(styles["nxui-sidepanel-content"], className)}>{children}</div>;
}

SidePanel.Content = Content;
SidePanel.Separator = Separator;
export default SidePanel;
