import React from "react";
import { Link } from "react-router";
import { GithubButton } from "@nuvix/ui/modules";
import { cn } from "@nuvix/sui/lib/utils";
import { NavMenu } from "./navbar";

const Header: React.FC<{ defaultTransBg?: boolean }> = ({ defaultTransBg = true }) => {
  const [isScrolled, setIsScrolled] = React.useState(defaultTransBg ? false : true);

  React.useEffect(() => {
    const handleScroll = defaultTransBg
      ? () => {
          setIsScrolled(window.scrollY > 50);
        }
      : () => {};

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`h-18 sticky top-0 left-0 flex w-full justify-between items-center px-4 py-2 z-[999] transition-colors ${isScrolled ? "page-background border-b" : ""}`}
    >
      <div className="flex items-center justify-between gap-2 w-full cont px-2.5 md:px-5">
        <div
          data-theme={isScrolled ? undefined : "dark"}
          className={cn("flex items-center gap-4 flex-1")}
        >
          <Link to={"/"}>
            <img
              src={`/trademark/logo-dark.png`}
              width={100}
              alt="logo"
              className={cn(!isScrolled ? "block" : "hidden", "transition-all")}
            />
            <img
              src={`/trademark/logo-light.png`}
              width={100}
              alt="logo"
              className={cn(isScrolled ? "block" : "hidden", "transition-all")}
            />
          </Link>
          <NavMenu />
        </div>
        <aside>
          <div className="flex items-center">
            <GithubButton />
          </div>
        </aside>
      </div>
    </header>
  );
};

export default Header;
