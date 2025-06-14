import { Dialog, Flex } from "@nuvix/ui/components";
import React from "react";
import { Form, FormikProps, FormikConfigs } from "./form";
import { FormikValues } from "formik";

interface FormDialogProps<Values extends FormikValues = FormikValues, V = {}> {
  dialog: Omit<React.ComponentProps<typeof Dialog>, "children">;
  form: FormikProps<Values> | FormikConfigs<Values, V>;
  children: React.ReactNode;
  ref: any;
}

const FormDialogComponent = <T extends FormikValues, V>({
  dialog: { footer, ...restDialog },
  form: { ...restForm },
  children,
  ref,
}: FormDialogProps<T, V>) => {
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
