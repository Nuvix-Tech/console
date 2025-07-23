// import { BackgroundGradient } from "components/ui/background-gradient";
import React, { useEffect, useState } from "react";
import { NavMenu } from "./navbar";
import { Button } from "@nuvix/sui/components/button";
// import { sdk } from "~/lib/sdk";

const Header: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);

  // useEffect(() => {
  //   async function check() {
  //     try {
  //       await sdk.account.get();
  //       setIsLogged(true);
  //     } catch {}
  //   }
  //   check();
  // }, []);

  return (
    <header className="h-18 fixed top-0 left-0 flex w-full border-b justify-between items-center bg-background/10 backdrop-blur-lg px-4 py-2 z-[999]">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-2 flex-1">
          <img
            src="https://server.nuvix.in/public/images/nuvix-logo-dark.svg"
            width={100}
            alt="logo"
          />
          <NavMenu />
        </div>
        <aside>
          {/* <BackgroundGradient containerClassName="p-0.5"> */}
          {isLogged ? (
            <Button
              className="rounded-full bg-orange-600/30 text-white hover:text-black"
              onClick={() => (window.location.href = "https://console.nuvix.in")}
            >
              Go to Console
            </Button>
          ) : (
            <Button className="rounded-full">Sign In</Button>
          )}
          {/* </BackgroundGradient> */}
        </aside>
      </div>
    </header>
  );
};

export default Header;
