import { Row } from "@nuvix/ui/components";
import { GithubButton } from "@nuvix/ui/modules";
import { ThemeSwitch } from "./theme-switch";
import { Logo } from "@nuvix/ui/components";
import Link from "next/link";
import { SidebarTrigger } from "@/components/root/sidebar";
import { cn } from "@nuvix/sui/lib/utils";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { SidebarIcon } from "lucide-react";

export const NavBar = () => {
  return (
    <Row className="gap-2 h-12 min-h-12 w-full flex px-4 items-center" id="nav_bar">
      <SidebarTrigger
        className={cn(
          buttonVariants({
            color: "ghost",
            size: "icon-sm",
            className: "pr-2",
          }),
          "!pl-0 md:hidden",
        )}
      >
        <SidebarIcon />
      </SidebarTrigger>
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
