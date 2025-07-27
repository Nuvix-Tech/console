import React, { useEffect, useState } from "react";
import { NavMenu } from "./navbar";
import { nuvix } from "~/lib/sdk";
import { Button } from "@nuvix/ui/components";

const Header: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        await nuvix.account.get();
        setIsLogged(true);
      } catch {}
    }
    check();
  }, []);

  return (
    <header className="h-18 fixed top-0 left-0 flex w-full border-b justify-between items-center bg-background/10 backdrop-blur-lg px-4 py-2 z-[999]">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-2 flex-1">
          <img
            src="https://server.nuvix.in/public/images/nuvix-logo-dark.svg"
            width={100}
            alt="logo"
            className="hidden dark:block"
          />
          <img
            src="https://server.nuvix.in/public/images/nuvix-logo-dark.svg"
            width={100}
            alt="logo"
            className="block dark:hidden"
          />
          <NavMenu />
        </div>
        <aside>
          {isLogged ? (
            <Button
              variant="secondary"
              onClick={() => (window.location.href = "https://console.nuvix.in")}
            >
              Go to Console
            </Button>
          ) : (
            <Button onClick={() => (window.location.href = "https://console.nuvix.in/auth/login")}>
              Sign In
            </Button>
          )}
        </aside>
      </div>
    </header>
  );
};

export default Header;
