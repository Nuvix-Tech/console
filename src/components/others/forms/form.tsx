import React from "react";
import { Formik, FormikConfig, FormikValues } from "formik";

type Form = {
  children: React.ReactNode;
  className?: string;
};

function Form<Values extends FormikValues = FormikValues, ExtraProps = {}>(
  props: FormikConfig<Values> & ExtraProps & Form,
): React.JSX.Element {
  const { children, className, ...rest } = props;
  return (
    <Formik {...rest}>
      {(props: any) => (
        <form className={className} onSubmit={props.handleSubmit}>
          {children}
        </form>
      )}
    </Formik>
  );
}

export { Form };
