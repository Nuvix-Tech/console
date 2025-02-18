import { Button, ButtonProps } from "@chakra-ui/react";
import { useFormikContext } from "formik";

type Props = ButtonProps;

export default function (props: Props) {
  const { ...rest } = props;

  const { isSubmitting, isValid, dirty } = useFormikContext();

  return <Button type="submit" loading={isSubmitting} disabled={!isValid || !dirty} {...rest} />;
}
