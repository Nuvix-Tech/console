import { Dialog, Flex } from "@/ui/components";
import React from "react";
import { Form } from "./form";

interface FormDialogProps {
  dialog: Omit<React.ComponentProps<typeof Dialog>, "children">;
  form: Omit<React.ComponentProps<typeof Form>, "children">;
  children: React.ReactNode;
}

export const FormDialog = ({
  dialog: { footer, ...restDialog },
  form: { ...restForm },
  children,
}: FormDialogProps) => {
  return (
    <Dialog {...restDialog}>
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
