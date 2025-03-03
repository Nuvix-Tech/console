"use client";

import classNames from "classnames";
import React from "react";
import { forwardRef, useState } from "react";
import { Input, Text } from ".";
import { Flex } from ".";
import { IconButton } from ".";
import styles from "./NumberInput.module.scss";
import { Checkbox } from "@/components/cui/checkbox";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

export interface NumberInputProps
  extends Omit<React.ComponentProps<typeof Input>, "type" | "value" | "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  padStart?: number;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    { value, onChange, min, max, step = 1, nullable = false, isNull = false, padStart, ...props },
    ref,
  ) => {
    const [localValue, setLocalValue] = useState<string>(
      padStart && value !== undefined
        ? value.toString().padStart(padStart, "0")
        : (value?.toString() ?? ""),
    );
    const [prev, setPrev] = useState<any>();
    const [_null, setNull] = useState(isNull);
    const checkBoxId = React.useId();

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
              <Checkbox
                size="xs"
                ids={{
                  root: checkBoxId,
                  control: `${checkBoxId}-input`,
                  label: `${checkBoxId}-label`,
                  hiddenInput: `${checkBoxId}-hidden-input`,
                }}
                marginRight="2"
                checked={_null}
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
              </Checkbox>
            )}
            <Flex minWidth={1.25}></Flex>
            <Flex
              position="absolute"
              right="0"
              top="0"
              direction="column"
              borderLeft="neutral-medium"
              fillHeight
              background="neutral-alpha-weak"
            >
              <Flex
                fillHeight
                borderBottom="neutral-medium"
                paddingX="4"
                className={classNames(styles.stepper, "transition-micro-medium")}
              >
                <IconButton
                  type="button"
                  variant="ghost"
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
              >
                <IconButton
                  type="button"
                  variant="ghost"
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
