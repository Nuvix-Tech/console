import { IconButton, Row, Text } from "@nuvix/ui/components";
import { Link } from "react-router";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Row
      height={"64"}
      background="surface"
      borderTop="neutral-medium"
      vertical="center"
      onBackground="neutral-weak"
      className="px-4"
      horizontal="space-between"
    >
      <Row gap="4">
        © {year} <Text onBackground="neutral-medium">Nuvix</Text>. All rights reserved.
      </Row>
      <Link to={"https://github.com/Nuvix-Tech"} target="_blank">
        <IconButton icon="github" variant="secondary" />
      </Link>
    </Row>
  );
};
