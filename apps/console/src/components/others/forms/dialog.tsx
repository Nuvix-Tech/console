import { Dialog, Flex } from "@nuvix/ui/components";
import React from "react";
import { Form } from "./form";

interface FormDialogProps {
  dialog: Omit<React.ComponentProps<typeof Dialog>, "children">;
  form: Omit<React.ComponentProps<typeof Form>, "children">;
  children: React.ReactNode;
  ref: any;
}

const FormDialogComponent = ({
  dialog: { footer, ...restDialog },
  form: { ...restForm },
  children,
  ref,
}: FormDialogProps) => {
  return (
    <Dialog ref={ref} {...restDialog}>
      <Form {...restForm}>
        {children}
        <Flex
          borderTop="neutral-medium"
          as="footer"
          horizontal="end"
          padding="12"
          gap="8"
          className="mx-[-1.5rem] mb-[-1.5rem]"
          marginTop="24"
        >
          {footer}
        </Flex>
      </Form>
    </Dialog>
  );
};

export const FormDialog = React.forwardRef<HTMLDivElement, FormDialogProps>((props, ref) => (
  <FormDialogComponent ref={ref} {...props} />
));
