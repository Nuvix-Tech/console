"use client";

import classNames from "classnames";
import React, { useRef, type ReactNode, forwardRef } from "react";
import { Flex, Icon, type IconProps } from ".";
import buttonStyles from "./Button.module.scss";
import { ElementType } from "./ElementType";
import iconStyles from "./IconButton.module.scss";
import { Tooltip, TooltipContent, TooltipTrigger } from "@nuvix/sui/components/tooltip";

interface CommonProps {
  icon?: IconProps["name"];
  id?: string;
  size?: "s" | "m" | "l";
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
  tooltip?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "ghost";
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  children?: ReactNode;
  disabled?: boolean;
  tooltipOffset?: number;
}

export type IconButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps | AnchorProps>(
  (
    {
      icon = "refresh",
      size = "m",
      id,
      radius,
      tooltip,
      tooltipPosition = "top",
      tooltipOffset = 4,
      variant = "primary",
      href,
      children,
      className,
      style,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

    const content = tooltip ? (
      <Tooltip>
        <TooltipTrigger asChild>
          {children ? children : <Icon name={icon} size={size === "l" ? "m" : "s"} />}
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    ) : children ? (
      children
    ) : (
      <Icon name={icon} size={size === "l" ? "m" : "s"} />
    );

    const radiusSize = size === "s" || size === "m" ? "m" : "l";

    return (
      <ElementType
        id={id}
        href={href}
        ref={(node: any) => {
          btnRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        className={classNames(
          buttonStyles.button,
          buttonStyles[variant],
          iconStyles[size],
          className,
          radius === "none"
            ? "radius-none"
            : radius
              ? `radius-${radiusSize}-${radius}`
              : `radius-${radiusSize}`,
          "text-decoration-none",
          "button",
          "cursor-interactive",
          className,
        )}
        style={style}
        aria-label={tooltip || icon}
        type={href ? undefined : type}
        {...props}
      >
        <Flex fill center className="relative">
          {content}
        </Flex>
      </ElementType>
    );
  },
);

IconButton.displayName = "IconButton";
export { IconButton };
