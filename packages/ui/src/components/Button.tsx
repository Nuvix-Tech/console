"use client";

import classNames from "classnames";
import type React from "react";
import { type ReactNode, forwardRef, useEffect, useState } from "react";
import { ElementType } from "./ElementType";

import { Arrow, Flex, Icon, IconButtonProps, Spinner, Tooltip, IconProps } from ".";
import styles from "./Button.module.scss";
import iconStyles from "./IconButton.module.scss";

interface CommonProps {
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  size?: "xs" | "s" | "m" | "l";
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
  label?: string;
  weight?: "default" | "strong";
  prefixIcon?: IconProps["name"];
  suffixIcon?: IconProps["name"];
  loading?: boolean;
  fillWidth?: boolean;
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
  children?: ReactNode;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  arrowIcon?: boolean;
  disabled?: boolean;
  asChild?: boolean;
}

export type ButtonProps = CommonProps &
  Pick<IconButtonProps, "tooltip" | "tooltipPosition"> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;
export type AnchorProps = CommonProps &
  Pick<IconButtonProps, "tooltip" | "tooltipPosition"> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps | AnchorProps>(
  (
    {
      variant = "primary",
      size = "m",
      radius,
      label,
      weight = "strong",
      children,
      prefixIcon,
      suffixIcon,
      loading = false,
      fillWidth = false,
      justifyContent = "center",
      href,
      id,
      arrowIcon = false,
      className,
      style,
      tooltip,
      tooltipPosition = "top",
      ...props
    },
    ref,
  ) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (isHover) {
        timer = setTimeout(() => {
          setTooltipVisible(true);
        }, 400);
      } else {
        setTooltipVisible(false);
      }

      return () => clearTimeout(timer);
    }, [isHover]);

    const iconSize = size === "l" ? "s" : size === "m" ? "s" : "xs";
    const radiusSize = size === "s" || size === "m" ? "m" : "l";

    return (
      <ElementType
        id={id}
        href={href}
        ref={ref}
        className={classNames(
          styles.button,
          styles[variant],
          styles[size],
          radius === "none"
            ? "radius-none"
            : radius
              ? `radius-${radiusSize}-${radius}`
              : `radius-${radiusSize}`,
          "text-decoration-none",
          "button",
          "cursor-interactive",
          {
            ["fill-width"]: fillWidth,
            ["fit-width"]: !fillWidth,
            ["justify-" + justifyContent]: justifyContent,
          },
          className,
        )}
        style={style}
        {...props}
        onMouseEnter={(e: any) => {
          setIsHover(true);
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e: any) => {
          setIsHover(false);
          props.onMouseLeave?.(e);
        }}
      >
        {prefixIcon && !loading && <Icon name={prefixIcon} size={iconSize} />}
        {loading && <Spinner size={size} />}
        {(label || children) && (
          <Flex
            paddingX="4"
            paddingY="0"
            textWeight={weight}
            textSize={size}
            className={classNames({
              "font-s font-body": size === "xs",
              "font-label": size !== "xs",
            })}
            align="center"
            vertical="center"
          >
            {label || children}
          </Flex>
        )}
        {arrowIcon && (
          <Arrow
            style={{
              marginLeft: "calc(-1 * var(--static-space-4))",
            }}
            trigger={"#" + id}
            scale={size === "s" ? 0.8 : size === "m" ? 0.9 : 1}
            color={variant === "primary" ? "onSolid" : "onBackground"}
          />
        )}
        {suffixIcon && <Icon name={suffixIcon} size={iconSize} />}
        {tooltip && isTooltipVisible && (
          <Flex position="absolute" zIndex={1} className={iconStyles[tooltipPosition]}>
            <Tooltip label={tooltip} />
          </Flex>
        )}
      </ElementType>
    );
  },
);

Button.displayName = "Button";
export { Button };
