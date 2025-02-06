"use client";

import { Column, Icon, Row, ToggleButton } from "@/once-ui/components";
import { usePathname } from "next/navigation";

const ProjectSidebar: React.FC = ({}) => {
  const pathname = usePathname() ?? "";

  return (
    <Column
      maxWidth={16}
      fill
      paddingX="16"
      paddingY="32"
      gap="m"
      background="surface"
      border="neutral-weak"
    >
      <Column fill paddingX="xs" gap="m">
        <Column fillWidth gap="4">
          <ToggleButton size="l" fillWidth justifyContent="flex-start" selected={true}>
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-l">
              <Icon name="PiHouseDuotone" onBackground="neutral-weak" size="xs" />
              Dashboard
            </Row>
          </ToggleButton>
          <ToggleButton
            size="l"
            fillWidth
            justifyContent="flex-start"
            selected={pathname === "analytics"}
          >
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-l">
              <Icon name="PiTrendUpDuotone" onBackground="neutral-weak" size="xs" />
              Auth
            </Row>
          </ToggleButton>
          <ToggleButton
            style={{
              position: "relative",
            }}
            size="l"
            fillWidth
            // disabled
            justifyContent="flex-start"
            selected={pathname === "reports"}
          >
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-l">
              <Icon name="PiNotebookDuotone" onBackground="neutral-weak" size="xs" />
              Functions
              {/* <Tag variant="neutral" size="s" position="absolute" right="8">
                soon
              </Tag> */}
            </Row>
          </ToggleButton>
          <ToggleButton
            size="l"
            fillWidth
            justifyContent="flex-start"
            selected={pathname === "analytics"}
          >
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-l">
              <Icon name="" onBackground="neutral-weak" size="xs" />
              Databases
            </Row>
          </ToggleButton>
          <ToggleButton
            size="l"
            fillWidth
            justifyContent="flex-start"
            selected={pathname === "analytics"}
          >
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-l">
              <Icon name="" onBackground="neutral-weak" size="xs" />
              Messaging
            </Row>
          </ToggleButton>
          <ToggleButton
            size="l"
            fillWidth
            justifyContent="flex-start"
            selected={pathname === "analytics"}
          >
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-l">
              <Icon name="" onBackground="neutral-weak" size="xs" />
              Storage
            </Row>
          </ToggleButton>
        </Column>
      </Column>
    </Column>
  );
};

ProjectSidebar.displayName = "Sidebar";
export { ProjectSidebar };
