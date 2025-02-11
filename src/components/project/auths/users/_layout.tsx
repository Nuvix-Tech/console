"use client";
import { getProjectState } from "@/state/project-state";
import { usePathname } from "next/navigation";
import { Column, Icon, Line, Row, Text, ToggleButton } from "@/ui/components";
import React from "react";


export const UsersLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = getProjectState();
  const pathname = usePathname() ?? "";


  state.sidebar = (
    <Column fill paddingX="xs" gap="m">
      <Column fillWidth gap="4">
        <Text
          variant="body-default-xs"
          onBackground="neutral-weak"
          marginBottom="8"
          marginLeft="16"
        >
          MANAGE
        </Text>
        <ToggleButton fillWidth justifyContent="flex-start" selected={pathname === "users"}>
          <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
            Users
          </Row>
        </ToggleButton>
        <ToggleButton fillWidth justifyContent="flex-start" selected={pathname === "analytics"}>
          <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
            <Icon name="PiTrendUpDuotone" onBackground="neutral-weak" size="xs" />
            Audit Logs
          </Row>
        </ToggleButton>
      </Column>

      <Line />

      <Column fillWidth gap="4">
        <Text
          variant="body-default-xs"
          onBackground="neutral-weak"
          marginBottom="8"
          marginLeft="16"
          style={{
            textTransform: "uppercase",
          }}
        >
          Configuration
        </Text>
        <ToggleButton fillWidth justifyContent="flex-start" selected={false}>
          <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
            General
          </Row>
        </ToggleButton>
        <ToggleButton fillWidth justifyContent="flex-start" selected={pathname === "analytics"}>
          <Row padding="4" vertical="center" gap="12" textVariant="label-default-s">
            Authentication
          </Row>
        </ToggleButton>
      </Column>
    </Column>
  );


  return (
    <>
      {children}
    </>
  );
}