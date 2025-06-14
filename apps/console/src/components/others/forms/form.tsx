import React from "react";
import {
  Formik,
  FormikConfig,
  FormikValues,
  useFormik,
  FormikContext,
  FormikFormProps,
  Form as FormikForm,
} from "formik";

type Form = {
  children: React.ReactNode;
  className?: string;
};

export type FormikConfigs<T, V> = FormikConfig<T> & V;
export type FormikProps<T extends FormikValues> = ReturnType<typeof useFormik<T>>;

function Form<Values extends FormikValues = FormikValues, ExtraProps = {}>(
  props: (FormikConfigs<Values, ExtraProps> | FormikProps<Values> | FormikFormProps) & Form,
): React.JSX.Element {
  const { children, className, ...rest } = props;

  if ("handleSubmit" in rest) {
    return (
      <FormikContext.Provider value={rest}>
        <form className={className} onSubmit={rest.handleSubmit} onReset={rest.handleReset}>
          {children}
        </form>
      </FormikContext.Provider>
    );
  } else if ("onSubmit" in rest) {
    return (
      <Formik {...rest}>
        {(props: any) => (
          <form className={className} onSubmit={props.handleSubmit}>
            {children}
          </form>
        )}
      </Formik>
    );
  } else {
    return (
      <FormikForm className={className} {...rest}>
        {children}
      </FormikForm>
    );
  }
}

export { Form };
