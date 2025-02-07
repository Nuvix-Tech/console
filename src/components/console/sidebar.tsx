"use client";

import { Column, Icon, Row, ToggleButton } from "@/ui/components";
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
      border="neutral-medium"
      style={{
        borderWidth: 0,
        borderRightWidth: 1,
      }}
    >
      <Column fill paddingX="xs" gap="m">
        <Column fillWidth gap="4">
          <ToggleButton size="l" fillWidth justifyContent="flex-start" selected={true}>
            <Row padding="4" vertical="center" gap="12" textVariant="label-default-l">
              <Icon name="PiHouseDuotone" onBackground="neutral-weak" size="xs" />
              <span className="icon-chart-bar" aria-hidden="true"></span>
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
              <span className="icon-user-group" aria-hidden="true"></span>
              Authentication
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
              <span className="icon-lightning-bolt" aria-hidden="true"></span>
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
              <span className="icon-database" aria-hidden="true"></span>
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
              <span className="icon-send" aria-hidden="true"></span>
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
              <span className="icon-folder" aria-hidden="true"></span>
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
