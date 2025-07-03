import { Column, Row, SmartLink, Text, ToggleButton, Line } from "@nuvix/ui/components";
import React from "react";

interface SidebarGroupItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
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

        {items.map((item, _) =>
          item.href && !item.disabled ? (
            <SmartLink href={item.href} key={_} unstyled fillWidth>
              <ToggleButton fillWidth justifyContent="flex-start" selected={!!item.isSelected}>
                <Row
                  padding={title ? "4" : "0"}
                  vertical="center"
                  gap="12"
                  textVariant="label-default-s"
                >
                  {item.icon}
                  {item.label}
                </Row>
              </ToggleButton>
            </SmartLink>
          ) : (
            <ToggleButton
              key={_}
              fillWidth
              disabled={item.disabled}
              justifyContent="flex-start"
              selected={!!item.isSelected}
              onClick={item.onClick}
            >
              <Row
                padding={title ? "4" : "0"}
                vertical="center"
                gap="12"
                textVariant={"label-default-s"}
                opacity={item.disabled ? 60 : 100}
              >
                {item.icon}
                {item.label}
              </Row>
            </ToggleButton>
          ),
        )}
      </Column>
      {bottomLine && <Line />}
    </>
  );
};

export { SidebarGroup };
