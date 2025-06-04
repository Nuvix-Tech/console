import { Button, ButtonProps } from "@nuvix/ui/components";
import { ButtonProps as B } from "@chakra-ui/react";
import { useFormikContext } from "formik";

type Props = ButtonProps & B;

export default function (props: Props) {
  const { ...rest } = props;
  const { isSubmitting, isValid, dirty, errors } = useFormikContext();

  return (
    <Button
      {...rest}
      type="submit"
      disabled={!isValid || !dirty || isSubmitting}
      loading={isSubmitting && isValid}
    />
  );
}
