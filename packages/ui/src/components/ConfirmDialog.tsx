"use client";
import React from "react";
import { Button, Input } from ".";
import { Dialog, Portal } from "@chakra-ui/react";

export type Variant = "danger" | "primary" | "secondary" | "tertiary";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  element?: React.ReactNode;
  cancel?: {
    text?: string;
    variant?: Variant;
    props?: React.ComponentProps<typeof Button>;
  };
  confirm?: {
    text?: string;
    variant?: Variant;
    disabled?: boolean;
    props?: React.ComponentProps<typeof Button>;
  };
  portalled?: boolean;
  input?:
    | {
        label?: string;
        type?: React.HTMLInputTypeAttribute;
        placeholder?: string;
        defaultValue?: string;
        validate?: (value: string) => boolean | string;
      }
    | {
        element: React.ReactNode;
        getValue: () => any; // how to extract the value
        validate?: (value: any) => boolean | string;
      };

  onConfirm: (result: boolean | string | any) => void | Promise<void>;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  element,
  cancel,
  confirm,
  portalled = true,
  input,
  onConfirm,
  onClose,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(
    input && "defaultValue" in input ? (input.defaultValue ?? "") : "",
  );
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setLoading(false);
      setValue("defaultValue" in (input ?? {}) ? ((input as any)?.defaultValue ?? "") : undefined);
      setError(null);
    }
  }, [isOpen, input]);

  const handleAction = async (result: boolean) => {
    if (!result) {
      onConfirm(false);
      return;
    }

    const finalValue = validate();
    if (finalValue === undefined) return; // validation failed

    setLoading(true);
    try {
      await onConfirm(finalValue);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let finalValue: any = true;

    if (input) {
      if ("element" in input) {
        // Custom input
        finalValue = input.getValue();
        if (input.validate) {
          const res = input.validate(finalValue);
          if (res !== true) {
            setError(typeof res === "string" ? res : "Invalid input");
            return;
          }
        }
      } else {
        // Built-in <input />
        finalValue = value;
        if (input.validate) {
          const res = input.validate(finalValue);
          if (res !== true) {
            setError(typeof res === "string" ? res : "Invalid input");
            return;
          }
        }
      }
    }

    setError(null);
    return finalValue;
  };

  React.useEffect(() => {
    if (input && "validate" in input && value !== undefined) {
      const res = input.validate?.(value);
      if (res !== true) {
        setError(typeof res === "string" ? res : "Invalid input");
        return;
      }
    }
    setError(null);
  }, [value, input]);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={() => onClose()}
      closeOnEscape
      closeOnInteractOutside={false}
      unmountOnExit
      modal
      size="xs"
      placement="center"
    >
      <Portal disabled={!portalled}>
        <Dialog.Backdrop />
        <Dialog.Positioner className="bg-[var(--backdrop)]" zIndex={10000}>
          <Dialog.Content shadow="none" border="1px" borderStyle="solid" borderColor="border">
            <Dialog.Header flexDirection="column" gap={0.5}>
              <Dialog.Title>{title}</Dialog.Title>
              {description && <Dialog.Description>{description}</Dialog.Description>}
            </Dialog.Header>

            {element && <Dialog.Body>{element}</Dialog.Body>}

            {input && (
              <Dialog.Body>
                {"element" in input ? (
                  <>
                    {input.element}
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                  </>
                ) : (
                  <>
                    {input.label && (
                      <label className="block text-sm font-medium mb-1 neutral-on-background-medium">
                        {input.label}
                      </label>
                    )}
                    <Input
                      labelAsPlaceholder
                      height="s"
                      type={input.type ?? "text"}
                      value={value as string}
                      placeholder={input.placeholder}
                      onChange={(e) => setValue(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                  </>
                )}
              </Dialog.Body>
            )}

            <Dialog.Footer>
              <Button
                size="s"
                variant={cancel?.variant ?? "secondary"}
                onClick={() => handleAction(false)}
                disabled={loading || cancel?.props?.disabled}
                {...cancel?.props}
              >
                {cancel?.text ?? "Cancel"}
              </Button>
              <Button
                size="s"
                variant={confirm?.variant ?? "primary"}
                onClick={() => handleAction(true)}
                loading={loading}
                disabled={loading || confirm?.disabled || !!error || confirm?.props?.disabled}
                {...confirm?.props}
              >
                {confirm?.text ?? "Continue"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
