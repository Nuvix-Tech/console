import { Button, ButtonProps } from "@nuvix/ui/components";
import { ButtonProps as B } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React from "react";

type Props = ButtonProps & B;

const SubmitButton = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { loadingText, ...rest } = props;
  const { isSubmitting, isValid, dirty, errors } = useFormikContext();
  console.log(errors);
  return (
    <Button
      ref={ref}
      size="s"
      {...rest}
      type="submit"
      disabled={!isValid || !dirty || isSubmitting}
      loading={isSubmitting && isValid}
    />
  );
});

SubmitButton.displayName = "SubmitButton";
export default SubmitButton;
