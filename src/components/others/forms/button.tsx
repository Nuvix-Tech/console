import { Button } from "@/components/ui/button";
import { ButtonProps } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { Loader2 } from "lucide-react";

type Props = ButtonProps;

export default function (props: Props) {
  const { ...rest } = props;

  const { isSubmitting, isValid, dirty } = useFormikContext();

  return (
    <Button type="submit" disabled={!isValid || !dirty || isSubmitting}>
      {isSubmitting ? <Loader2 className="animate-spin" /> : null}
      {props.children}
    </Button>
  );
}
