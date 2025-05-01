"use client";
import classNames from "classnames";
import React from "react";
import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Flex, Text } from ".";
import useDebounce from "../hooks/useDebounce";
import styles from "./Input.module.scss";
import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";

interface CheckboxProps extends ChakraCheckbox.RootProps {
  icon?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  const { icon, children, inputProps, rootRef, ...rest } = props;
  return (
    <ChakraCheckbox.Root ref={rootRef} {...rest}>
      <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />
      <ChakraCheckbox.Control>{icon || <ChakraCheckbox.Indicator />}</ChakraCheckbox.Control>
      {children != null && <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>}
    </ChakraCheckbox.Root>
  );
});

export { Checkbox as Checkbox_Chakra };

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  height?: "s" | "m";
  error?: boolean;
  layout?: "horizontal" | "vertical";
  errorMessage?: ReactNode;
  description?: ReactNode;
  radius?:
    | "none"
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-left"
    | "top-right"
    | "bottom-right"
    | "bottom-left";
  className?: string;
  style?: React.CSSProperties;
  hasPrefix?: ReactNode;
  hasSuffix?: ReactNode;
  labelAsPlaceholder?: boolean;
  validate?: (value: ReactNode) => ReactNode | null;
  nullable?: boolean;
  isNull?: boolean;
  inputClass?: string;
  labelOptional?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      height = "m",
      error = false,
      errorMessage,
      description,
      radius,
      className,
      style,
      hasPrefix,
      hasSuffix,
      labelAsPlaceholder = false,
      children,
      onFocus,
      onBlur,
      validate,
      nullable = false,
      isNull = false,
      maxLength: max,
      onChange,
      inputClass,
      labelOptional,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(!!props.value);
    const [validationError, setValidationError] = useState<ReactNode | null>(null);
    const [prev, setPrev] = useState<any>();
    const [_null, setNull] = useState(isNull || props.value === null);
    const debouncedValue = useDebounce(props.value, 1000);
    const checkBoxId = React.useId();
    id = id ?? React.useId();

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (event.target.value) {
        setIsFilled(true);
      } else {
        setIsFilled(false);
      }
      if (onBlur) onBlur(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (_null) {
        setNull(false);
        setPrev(undefined);
      }
      if (onChange) onChange(event);
    };

    useEffect(() => {
      setIsFilled(!!props.value);
    }, [props.value]);

    const validateInput = useCallback(() => {
      if (!debouncedValue) {
        setValidationError(null);
        return;
      }

      if (validate) {
        const error = validate(debouncedValue);
        if (error) {
          setValidationError(error);
        } else {
          setValidationError(errorMessage || null);
        }
      } else {
        setValidationError(null);
      }
    }, [debouncedValue, validate, errorMessage]);

    useEffect(() => {
      validateInput();
    }, [debouncedValue, validateInput]);

    const displayError = validationError || errorMessage;

    const inputClassNames = classNames(styles.input, "font-body", "font-default", "font-m", {
      [styles.filled]: isFilled,
      [styles.focused]: isFocused,
      [styles.withPrefix]: hasPrefix,
      [styles.withSuffix]: hasSuffix,
      [styles.labelAsPlaceholder]: labelAsPlaceholder,
      [styles.hasChildren]: children,
      [styles.error]: displayError && debouncedValue !== "",
    });

    const optional = labelOptional && (
      <Text variant="label-default-m" onBackground="neutral-weak">
        ({labelOptional})
      </Text>
    );

    return (
      <Flex
        position="relative"
        direction="column"
        gap="8"
        style={style}
        fillWidth
        fitHeight
        className={classNames(className, {
          [styles.error]: (error || (displayError && debouncedValue !== "")) && props.value !== "",
        })}
      >
        <Flex
          transition="micro-medium"
          border="neutral-medium"
          background={"neutral-alpha-weak"}
          position="relative"
          overflow="hidden"
          vertical="stretch"
          className={classNames(
            styles.base,
            {
              [styles.s]: height === "s",
            },
            {
              [styles.m]: height === "m",
            },
            radius === "none" ? "radius-none" : radius ? `radius-l-${radius}` : "radius-l",
            {
              "!bg-[var(--neutral-solid-strong)]": props.disabled,
            },
            inputClass,
          )}
        >
          {hasPrefix && (
            <Flex paddingLeft="12" className={styles.prefix}>
              {hasPrefix}
            </Flex>
          )}
          <Flex fillWidth direction="column" position="relative">
            <input
              {...props}
              ref={ref}
              id={id}
              placeholder={
                labelAsPlaceholder
                  ? (label ?? props.placeholder) + ` ${optional}`
                  : props.placeholder + ` ${optional}`
              }
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              value={_null ? "" : props.value === null ? "" : props.value}
              maxLength={max}
              className={inputClassNames}
              aria-describedby={displayError ? `${id}-error` : undefined}
              aria-invalid={!!displayError}
            />
            {!labelAsPlaceholder && (
              <Text
                as="label"
                variant="label-default-m"
                htmlFor={id}
                className={classNames(styles.label, styles.inputLabel, {
                  [styles.floating]: isFocused || isFilled,
                })}
              >
                {label} {optional}
              </Text>
            )}
            {children}
          </Flex>

          {hasSuffix ? (
            <Flex
              paddingRight="12"
              className={classNames(styles.suffix, {
                "!bg-[var(--neutral-solid-strong)] !text-[var(--neutral-on-solid-weak)]":
                  props.disabled,
              })}
            >
              {hasSuffix}
            </Flex>
          ) : (
            <Flex horizontal="end" gap={"8"} paddingY="4" paddingRight={"8"} vertical="center">
              {max && max !== 0 && (props.value?.toString().length ?? 0) > 0 && (
                <Text variant="body-default-xs" onBackground="neutral-weak" wrap="nowrap">
                  {props.value?.toString().length || 0} / {max}
                </Text>
              )}
              {nullable && (
                <Checkbox
                  size="xs"
                  ids={{
                    root: checkBoxId,
                    control: `${checkBoxId}-input`,
                    label: `${checkBoxId}-label`,
                    hiddenInput: `${checkBoxId}-hidden-input`,
                  }}
                  checked={_null}
                  disabled={props.disabled}
                  onCheckedChange={(e) => {
                    setNull(!!e.checked);
                    if (e.checked) {
                      setPrev(props.value);
                      onChange?.({
                        target: {
                          name: id,
                          value: null,
                        },
                      } as any);
                    } else {
                      onChange?.({
                        target: {
                          name: id,
                          value: prev,
                        },
                      } as any);
                    }
                  }}
                >
                  <Text variant="body-default-xs" onBackground="neutral-weak" wrap="nowrap">
                    NULL
                  </Text>
                </Checkbox>
              )}
            </Flex>
          )}
        </Flex>
        {displayError && errorMessage !== false && (
          <Flex paddingX="16">
            <Text as="span" id={`${id}-error`} variant="body-default-s" onBackground="danger-weak">
              {validationError || errorMessage}
            </Text>
          </Flex>
        )}
        {description && (
          <Flex paddingX="16">
            <Text
              as="span"
              id={`${id}-description`}
              variant="body-default-s"
              onBackground="neutral-weak"
            >
              {description}
            </Text>
          </Flex>
        )}
      </Flex>
    );
  },
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
