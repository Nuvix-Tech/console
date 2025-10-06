"use client";

import classNames from "classnames";
import type React from "react";
import { type ReactNode, forwardRef, useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { Flex, Tooltip } from ".";
import { IconName } from "../icons";
import type { ColorScheme, ColorWeight } from "../types";
import styles from "./Icon.module.scss";
import iconStyles from "./IconButton.module.scss";
import { LucideIcon } from "lucide-react";
import { useIcons } from "../contexts";

export interface IconProps extends React.ComponentProps<typeof Flex> {
  name: IconName | Exclude<ReactNode, string> | IconType | LucideIcon;
  onBackground?: `${ColorScheme}-${ColorWeight}`;
  onSolid?: `${ColorScheme}-${ColorWeight}`;
  size?: "xs" | "s" | "m" | "l" | "xl";
  decorative?: boolean;
  tooltip?: ReactNode;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  iconWidth?: number;
  iconHeight?: number;
}

function isValidReactComponent(component: any): component is React.ComponentType<any> {
  return (
    typeof component === "function" ||
    (typeof component === "object" &&
      component !== null &&
      "$$typeof" in component &&
      typeof component.render === "function")
  );
}

const Icon = forwardRef<HTMLDivElement, IconProps>(
  (
    {
      name,
      onBackground,
      onSolid,
      size = "m",
      decorative = true,
      tooltip,
      tooltipPosition = "top",
      iconWidth,
      iconHeight,
      className,
      ...rest
    },
    ref,
  ) => {
    const { icons } = useIcons();
    const IconComponent: IconType | LucideIcon | ReactNode | undefined =
      typeof name === "string" ? icons[name as IconName] : name;

    if (!IconComponent) {
      console.warn(`Icon "${name}" does not exist in the library.`);
      return null;
    }

    if (onBackground && onSolid) {
      console.warn(
        "You cannot use both 'onBackground' and 'onSolid' props simultaneously. Only one will be applied.",
      );
    }

    let colorClass = "color-inherit";

    if (onBackground) {
      const [scheme, weight] = onBackground.split("-") as [ColorScheme, ColorWeight];
      colorClass = `${scheme}-on-background-${weight}`;
    } else if (onSolid) {
      const [scheme, weight] = onSolid.split("-") as [ColorScheme, ColorWeight];
      colorClass = `${scheme}-on-solid-${weight}`;
    }

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

    return (
      <Flex
        inline
        fit
        position="relative"
        as="span"
        ref={ref}
        className={classNames(colorClass, styles.icon, styles[size], className)}
        role={decorative ? "presentation" : undefined}
        aria-hidden={decorative ? "true" : undefined}
        aria-label={decorative ? undefined : "icon"}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        {...rest}
      >
        {isValidReactComponent(IconComponent) ? (
          <IconComponent width={iconWidth} height={iconHeight} className={colorClass} />
        ) : (
          (IconComponent as ReactNode) // fallback if already a valid ReactNode
        )}
        {tooltip && isTooltipVisible && (
          <Flex position="absolute" zIndex={1} className={iconStyles[tooltipPosition]}>
            <Tooltip label={tooltip} />
          </Flex>
        )}
      </Flex>
    );
  },
);

Icon.displayName = "Icon";

export { Icon };
