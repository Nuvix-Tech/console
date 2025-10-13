import { Row } from "@nuvix/ui/components";
import { GithubButton } from "@nuvix/ui/modules";
import { ThemeSwitch } from "./theme-switch";
import { Logo } from "@nuvix/ui/components";
import Link from "next/link";

export const NavBar = () => {
  return (
    <Row className="gap-2 h-12 w-full flex px-4 items-center" id="nav_bar">
      <Link href={"/"}>
        <Logo
          icon={false}
          size="s"
          className="dark:!hidden !block"
          wordmarkSrc="/trademark/logo-light.svg"
        />
        <Logo
          icon={false}
          size="s"
          className="!hidden dark:!block"
          wordmarkSrc="/trademark/logo-dark.svg"
        />
      </Link>
      <ThemeSwitch />
      <div className="flex gap-2 items-center">
        <GithubButton />
      </div>
    </Row>
  );
};
