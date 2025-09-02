import { Column, Row, SmartLink, Text, ToggleButton, Line } from "@nuvix/ui/components";
import React, { Fragment } from "react";

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
  itemProps?: React.ComponentProps<typeof ToggleButton>;
}

const SidebarGroup = ({
  title,
  items,
  titleUppercase = true,
  action,
  bottomLine,
  itemProps,
  ...rest
}: SidebarGroupProps & React.ComponentProps<typeof Column>) => {
  return (
    <Fragment key={title || "sidebar-group"}>
      <Column fillWidth gap="4" paddingX="xs" {...rest}>
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
            justifyContent="flex-start"
            selected={!!item.isSelected}
            onClick={item.onClick}
            disabled={item.disabled}
            prefixIcon={item.icon}
            {...itemProps}
          >
            <Row
              paddingX={title ? "4" : "0"}
              vertical="center"
              textVariant={"label-default-s"}
              opacity={item.disabled ? 60 : 100}
            >
              {item.label}
            </Row>
          </ToggleButton>
        ))}
      </Column>
      {bottomLine && <Line />}
    </Fragment>
  );
};

export { SidebarGroup };
