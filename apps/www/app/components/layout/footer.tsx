import { IconButton, Row, Text } from "@nuvix/ui/components";
import { ColorModeButton } from "@nuvix/cui/color-mode";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div data-theme="dark" className="page-background border-t border-border/40 h-96">
      <div className="flex gap-4">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <Row
        vertical="center"
        horizontal="space-between"
        className="flex-col md:flex-row gap-4 !container !mx-auto py-4"
      >
        <Row gap="4" vertical="center">
          <Text size="s" onBackground="neutral-weak">
            © {year} Nuvix. All rights reserved.
          </Text>
        </Row>
        <Row gap="8" vertical="center">
          <ColorModeButton />
          <IconButton
            icon="github"
            variant="secondary"
            href="https://github.com/Nuvix-Tech/nuvix"
          />
        </Row>
      </Row>
    </div>
  );
};

const FooterMenu = () => {};
