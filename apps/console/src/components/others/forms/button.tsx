import { Button, ButtonProps, Icon } from "@nuvix/ui/components";
import { ButtonProps as B } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";

type Props = ButtonProps &
  B & {
    dirtyCheck?: boolean;
  };

const SubmitButton = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { loadingText, dirtyCheck = true, ...rest } = props;
  const { isSubmitting, isValid, dirty, errors } = useFormikContext();
  const isDisabled = !isValid || (dirtyCheck && !dirty) || isSubmitting || props.disabled;

  return (
    <span className="inline-flex items-center gap-2">
      <Button
        ref={ref}
        size="s"
        {...rest}
        type="submit"
        disabled={isDisabled}
        loading={isSubmitting && isValid}
      />
      {!isValid ? (
        <Tooltip>
          <TooltipTrigger asChild className="cursor-pointer">
            <Icon name="infoCircle" size="m" onBackground="accent-weak" />
          </TooltipTrigger>
          <TooltipContent side="top" portal={false} className="max-w-xs !rounded-xs">
            <ul className="list-disc ml-4 ">
              {Object.values(errors).map((error: any, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      ) : undefined}
    </span>
  );
});

SubmitButton.displayName = "SubmitButton";
export default SubmitButton;
