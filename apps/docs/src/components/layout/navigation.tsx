import {
  Column,
  Row,
  SmartLink,
  Text,
  ToggleButton,
  Line,
  IconProps,
  Icon,
} from "@nuvix/ui/components";
import React from "react";

interface SidebarGroupItem {
  label: string;
  href?: string;
  icon?: IconProps["name"];
  endIcon?: IconProps["name"];
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
}

interface SidebarGroupProps {
  title?: string;
  action?: React.ReactNode;
  titleUppercase?: boolean;
  items: SidebarGroupItem[];
  bottomLine?: boolean;
}

const SidebarGroup = ({
  title,
  items,
  titleUppercase = true,
  action,
  bottomLine,
}: SidebarGroupProps) => {
  return (
    <>
      <Column fillWidth gap="4" paddingX="xs">
        {title || action ? (
          <Row
            fillWidth
            horizontal="space-between"
            vertical="center"
            paddingBottom="8"
            paddingX="4"
          >
            {title ? (
              <Text
                variant="body-default-xs"
                onBackground="neutral-weak"
                style={{
                  textTransform: titleUppercase ? "uppercase" : "inherit",
                }}
              >
                {title}
              </Text>
            ) : null}
            {action}
          </Row>
        ) : null}

        {items.map((item, _) => (
          <ToggleButton
            key={_}
            fillWidth
            href={item.href}
            justifyContent={"flex-start"}
            selected={!!item.isSelected}
            onClick={item.onClick}
            disabled={item.disabled}
            prefixIcon={item.icon}
            suffixIcon={item.endIcon}
            size="m"
          >
            <Row
              paddingX={title ? "4" : "0"}
              vertical="center"
              gap="12"
              textVariant="label-default-s"
            >
              {item.label}
            </Row>
          </ToggleButton>
        ))}
      </Column>
      {bottomLine && <Line />}
    </>
  );
};

export { SidebarGroup };
