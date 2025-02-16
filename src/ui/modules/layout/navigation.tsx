import { Column, Icon, Line, Row, SmartLink, Text, ToggleButton } from "@/ui/components";
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
  titleUppercase?: boolean;
  items: SidebarGroupItem[];
}

const SidebarGroup = ({ title, items, titleUppercase = true }: SidebarGroupProps) => {
  return (
    <Column fillWidth gap="4" paddingX="xs">
      {title && (
        <Text
          variant="body-default-xs"
          onBackground="neutral-weak"
          marginBottom="8"
          marginLeft="4"
          style={{
            textTransform: titleUppercase ? "uppercase" : "inherit",
          }}
        >
          {title}
        </Text>
      )}

      {items.map((item, _) =>
        item.href ? (
          <SmartLink href={item.href} key={_} unstyled fillWidth>
            <ToggleButton fillWidth justifyContent="flex-start" selected={!!item.isSelected}>
              <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
                {item.icon}
                {item.label}
              </Row>
            </ToggleButton>
          </SmartLink>
        ) : (
          <ToggleButton
            key={_}
            fillWidth
            justifyContent="flex-start"
            selected={!!item.isSelected}
            onClick={item.onClick}
          >
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
              {item.icon}
              {item.label}
            </Row>
          </ToggleButton>
        ),
      )}
    </Column>
  );
};

export { SidebarGroup };
