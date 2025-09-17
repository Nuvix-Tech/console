"use client";

import classNames from "classnames";
import type React from "react";
import { type ReactNode, forwardRef } from "react";
import { ElementType } from "./ElementType";

import { Arrow, Flex, Icon, IconButtonProps, Spinner, IconProps } from ".";
import styles from "./Button.module.scss";
import { Tooltip, TooltipTrigger, TooltipContent } from "@nuvix/sui/components/tooltip";

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
  tooltipProps?: React.ComponentPropsWithoutRef<typeof TooltipContent>;
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
      tooltipProps,
      ...props
    },
    ref,
  ) => {
    const iconSize = size === "l" ? "s" : size === "m" ? "s" : "xs";
    const radiusSize = size === "s" || size === "m" ? "m" : "l";

    return (
      <Wrapper tooltip={tooltip} tooltipProps={{ side: tooltipPosition, ...tooltipProps }}>
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
        </ElementType>
      </Wrapper>
    );
  },
);

const Wrapper = ({
  children,
  tooltip,
  tooltipProps,
}: {
  children: React.ReactNode;
  tooltip: any;
  tooltipProps?: any;
}) => {
  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent {...tooltipProps}>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }
  return children;
};

Button.displayName = "Button";
export { Button };
