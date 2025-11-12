import React from "react";
import { Button } from "@nuvix/ui/components";
import { DOCS_URL } from "~/lib/constants";
import { Link } from "react-router";
import { GithubButton } from "@nuvix/ui/modules";
import { cn } from "@nuvix/sui/lib/utils";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`h-18 fixed top-0 left-0 flex w-full justify-between items-center px-4 py-2 z-[999] transition-colors ${isScrolled ? "page-background border-b" : ""}`}
    >
      <div className="flex items-center justify-between gap-2 w-full container mx-auto px-4">
        <div
          data-theme={isScrolled ? undefined : "dark"}
          className={cn("flex items-center gap-4 flex-1 ")}
        >
          <Link to={"/"}>
            <img
              src={`/trademark/logo-dark.png`}
              width={100}
              alt="logo"
              className={cn(!isScrolled ? "block" : "hidden")}
            />
            <img
              src={`/trademark/logo-light.png`}
              width={100}
              alt="logo"
              className={cn(isScrolled ? "block" : "hidden")}
            />
          </Link>
          <Button
            href={DOCS_URL}
            label="Documentation"
            size="s"
            variant="tertiary"
            className="!hidden sm:!flex"
          />
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
