import { Button, ButtonProps } from "@nuvix/ui/components";
import { ButtonProps as B } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React from "react";

type Props = ButtonProps &
  B & {
    dirtyCheck?: boolean;
  };

const SubmitButton = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { loadingText, dirtyCheck = true, ...rest } = props;
  const { isSubmitting, isValid, dirty } = useFormikContext();
  const isDisabled = !isValid || (dirtyCheck && !dirty) || isSubmitting || props.disabled;

  return (
    <Button
      ref={ref}
      size="s"
      {...rest}
      type="submit"
      disabled={isDisabled}
      loading={isSubmitting && isValid}
    />
  );
});

SubmitButton.displayName = "SubmitButton";
export default SubmitButton;
