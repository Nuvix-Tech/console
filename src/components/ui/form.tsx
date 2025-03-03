"use client";
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useFormikContext } from "formik";

const useFormField = () => {
  const itemContext = React.useContext(FormItemContext);
  const { id, ...rest } = itemContext;

  return {
    id,
    ...rest,
  };
};

type FormItemContextValue = {
  id: string;
  name: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({
  className,
  ...props
}: React.ComponentProps<"div"> & Omit<FormItemContextValue, "id">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id, ...props }}>
      <div data-slot="form-item" className={cn("grid gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { name, id } = useFormField();
  const { errors } = useFormikContext<Record<string, any>>();

  return (
    <Label
      data-slot="form-label"
      data-error={!!errors[name]}
      className={cn("data-[error=true]:text-destructive-foreground", className)}
      htmlFor={id}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { id } = useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={id}
      // aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      // aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  // const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      // id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p"> & { field?: string }) {
  const { name } = useFormField();
  const { errors } = useFormikContext<Record<string, any>>();
  // const formMessageId = React.useId();
  const error = errors[name];
  const body = error ? String(error ?? "") : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      // id={formMessageId}
      className={cn("text-destructive-foreground text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useFormField,
  // Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  // FormField,
};
