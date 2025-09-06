import { Button, Row } from "@nuvix/ui/components";
import { ThemeSwitch } from "./theme-switch";

export const NavBar = () => {
  return (
    <Row className="gap-2" id="nav_bar">
      <ThemeSwitch />
      <div className="flex gap-2 items-center">
        <Button size="s">Go to Console</Button>
      </div>
    </Row>
  );
};
