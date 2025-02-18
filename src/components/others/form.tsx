import React from "react";
import { Formik, FormikConfig, FormikValues } from "formik";

type Form = {
  children: React.ReactNode;
};

function Form<Values extends FormikValues = FormikValues, ExtraProps = {}>(
  props: FormikConfig<Values> & ExtraProps & Form,
): React.JSX.Element {
  const { children, ...rest } = props;
  return (
    <Formik {...rest}>
      {(props: any) => <form onSubmit={props.handleSubmit}>{children}</form>}
    </Formik>
  );
}

export { Form };
