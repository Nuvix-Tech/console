"use client";

import classNames from "classnames";
import React, { useRef, useEffect, useState, type ReactNode, forwardRef } from "react";
import { createPortal } from "react-dom";
import { Flex, Icon, IconProps, Tooltip } from ".";
import buttonStyles from "./Button.module.scss";
import { ElementType } from "./ElementType";
import iconStyles from "./IconButton.module.scss";

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
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
    const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (isHover) {
        timer = setTimeout(() => {
          setTooltipVisible(true);

          if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            let top = rect.top;
            let left = rect.left;

            switch (tooltipPosition) {
              case "top":
                top = rect.top - tooltipOffset; // offset
                left = rect.left + rect.width / 2;
                break;
              case "bottom":
                top = rect.bottom + tooltipOffset;
                left = rect.left + rect.width / 2;
                break;
              case "left":
                top = rect.top + rect.height / 2;
                left = rect.left - tooltipOffset;
                break;
              case "right":
                top = rect.top + rect.height / 2;
                left = rect.right + tooltipOffset;
                break;
            }

            setCoords({ top, left });
          }
        }, 400);
      } else {
        setTooltipVisible(false);
      }

      return () => clearTimeout(timer);
    }, [isHover, tooltipPosition]);

    const content = (
      <>
        {children ? children : <Icon name={icon} size={size === "l" ? "m" : "s"} />}
        {tooltip &&
          isTooltipVisible &&
          coords &&
          createPortal(
            <Flex
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                transform:
                  tooltipPosition === "top" || tooltipPosition === "bottom"
                    ? "translateX(-50%)"
                    : "translateY(-50%)",
                zIndex: 1000,
              }}
            >
              <Tooltip label={tooltip} />
            </Flex>,
            document.body,
          )}
      </>
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
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
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
