import React, { useEffect, useState } from "react";
import { NavMenu } from "./navbar";
import { nuvix } from "~/lib/sdk";
import { Button } from "@nuvix/ui/components";
import { DASHBOARD_URL, SERVER_URL } from "~/lib/constants";
import { Link } from "react-router";

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
          <Link to={'/'}>
            <img
              src={`${SERVER_URL}/public/images/nuvix-logo-dark.svg`}
              width={100}
              alt="logo"
              className="hidden dark:block"
            />
            <img
              src={`${SERVER_URL}/public/images/nuvix-logo-light.svg`}
              width={100}
              alt="logo"
              className="block dark:hidden"
            />
          </Link>
          <NavMenu />
        </div>
        <aside>
          {isLogged ? (
            <Button
              variant="secondary"
              size="s"
              onClick={() => (window.location.href = DASHBOARD_URL)}
            >
              Go to Console
            </Button>
          ) : (
            <div className="flex items-center">
              <Button
                variant="secondary"
                size="s"
                onClick={() => (window.location.href = `${DASHBOARD_URL}/auth/login`)}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="s"
                onClick={() => (window.location.href = `${DASHBOARD_URL}/auth/register`)}
                className="ml-2"
              >
                Start your project
              </Button>
            </div>
          )}
        </aside>
      </div>
    </header>
  );
};

export default Header;
