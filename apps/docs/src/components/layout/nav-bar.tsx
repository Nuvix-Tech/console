import { Button, Row } from "@nuvix/ui/components";
import { ThemeSwitch } from "./theme-switch";

export const NavBar = () => {
  return (
    <Row className="ml-auto gap-2">
      <ThemeSwitch />
      <div className="flex gap-2 items-center">
        <Button size="s">Go to Console</Button>
      </div>
    </Row>
  );
};
