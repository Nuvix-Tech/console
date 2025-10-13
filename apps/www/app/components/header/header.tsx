import React from "react";
import { Button } from "@nuvix/ui/components";
import { DOCS_URL } from "~/lib/constants";
import { Link } from "react-router";
import { GithubButton } from "@nuvix/ui/modules";

const Header: React.FC = () => {
  return (
    <header className="h-18 fixed top-0 left-0 flex w-full border-b justify-between items-center bg-background/10 backdrop-blur-lg px-4 py-2 z-[999]">
      <div className="flex items-center justify-between gap-2 w-full container mx-auto px-4">
        <div className="flex items-center gap-4 flex-1">
          <Link to={"/"}>
            <img
              src={`/trademark/logo-dark.png`}
              width={100}
              alt="logo"
              className="hidden dark:block"
            />
            <img
              src={`/trademark/logo-light.png`}
              width={100}
              alt="logo"
              className="block dark:hidden"
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
