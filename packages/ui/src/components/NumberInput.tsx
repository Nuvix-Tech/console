"use client";

import classNames from "classnames";
import React, { useEffect } from "react";
import { forwardRef, useState } from "react";
import { Checkbox_Chakra, Input, Text } from ".";
import { Flex } from ".";
import { IconButton } from ".";
import styles from "./NumberInput.module.scss";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

export interface NumberInputProps
  extends Omit<React.ComponentProps<typeof Input>, "type" | "value" | "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  padStart?: number;
  externalyUpdate?: boolean;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      step = 1,
      nullable = false,
      isNull = false,
      padStart,
      externalyUpdate = false,
      ...props
    },
    ref,
  ) => {
    const [localValue, setLocalValue] = useState<string>(
      padStart && value !== undefined
        ? value.toString().padStart(padStart, "0")
        : (value?.toString() ?? ""),
    );
    const [prev, setPrev] = useState<any>();
    const [_null, setNull] = useState(isNull || value === null);
    const checkBoxId = React.useId();

    useEffect(() => {
      if (_null || !externalyUpdate) return;

      setLocalValue(
        padStart && value !== undefined
          ? value.toString().padStart(padStart, "0")
          : (value?.toString() ?? ""),
      );
    }, [value, padStart, _null, externalyUpdate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (_null) {
        setNull(false);
        setPrev(undefined);
      }
      const newValue = e.target.value;
      setLocalValue(newValue);

      const numValue = Number.parseFloat(newValue || "0");
      if (!isNaN(numValue) && onChange) {
        onChange(numValue);
      }
    };

    const updateValue = (newValue: number) => {
      const formattedValue = padStart
        ? newValue.toString().padStart(padStart, "0")
        : newValue.toString();
      setLocalValue(formattedValue);
      onChange?.(newValue);
    };

    const increment = () => {
      if (_null) {
        setNull(false);
        setPrev(undefined);
      }
      const currentValue = Number.parseFloat(localValue) || 0;
      const newValue = currentValue + step;
      if (max === undefined || newValue <= max) {
        updateValue(newValue);
      }
    };

    const decrement = () => {
      if (_null) {
        setNull(false);
        setPrev(undefined);
      }
      const currentValue = Number.parseFloat(localValue) || 0;
      const newValue = currentValue - step;
      if (min === undefined || newValue >= min) {
        updateValue(newValue);
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="number"
        value={_null ? "" : localValue}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        hasSuffix={
          <>
            {nullable && (
              <Checkbox_Chakra
                size="xs"
                ids={{
                  root: checkBoxId,
                  control: `${checkBoxId}-input`,
                  label: `${checkBoxId}-label`,
                  hiddenInput: `${checkBoxId}-hidden-input`,
                }}
                disabled={props.disabled}
                marginRight="2"
                checked={_null}
                className="bg-transparent"
                onCheckedChange={(e) => {
                  setNull(!!e.checked);
                  if (e.checked) {
                    setPrev(value);
                    onChange?.(null as any);
                  } else onChange?.(prev as any);
                }}
              >
                <Text variant="body-default-xs" onBackground="neutral-weak" wrap="nowrap">
                  NULL
                </Text>
              </Checkbox_Chakra>
            )}
            <Flex minWidth={1.25}></Flex>
            <Flex
              position="absolute"
              right="0"
              top="0"
              direction="column"
              borderLeft="neutral-medium"
              className={classNames({
                "!cursor-not-allowed neutral-solid-strong": props.disabled,
              })}
              fillHeight
            >
              <Flex
                fillHeight
                borderBottom="neutral-medium"
                paddingX="4"
                className={classNames(styles.stepper, "transition-micro-medium")}
                vertical="center"
              >
                <IconButton
                  type="button"
                  disabled={props.disabled}
                  variant="ghost"
                  className={classNames({
                    "!cursor-not-allowed !bg-transparent": props.disabled,
                  })}
                  size="s"
                  onClick={increment}
                  aria-label="Increment value"
                >
                  <LuChevronUp />
                </IconButton>
              </Flex>
              <Flex
                fillHeight
                paddingX="4"
                className={classNames(styles.stepper, "transition-micro-medium")}
                vertical="center"
              >
                <IconButton
                  type="button"
                  disabled={props.disabled}
                  variant="ghost"
                  className={classNames({
                    "!cursor-not-allowed !bg-transparent": props.disabled,
                  })}
                  size="s"
                  onClick={decrement}
                  aria-label="Decrement value"
                >
                  <LuChevronDown />
                </IconButton>
              </Flex>
            </Flex>
          </>
        }
        className={styles.numberInput}
      />
    );
  },
);

NumberInput.displayName = "NumberInput";
export { NumberInput };
