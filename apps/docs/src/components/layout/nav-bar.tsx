"use client";
import { Button, Row } from "@nuvix/ui/components";
import { ThemeSwitch } from "./theme-switch";
import { useEffect, useState } from "react";
import { Logo } from "@nuvix/ui/components";

export const NavBar = () => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch("https://api.github.com/repos/nuvix-tech/nuvix");
        const data = await response.json();
        setStars(data.stargazers_count);
      } catch (error) {
        console.error("Error fetching GitHub stars:", error);
      }
    };

    fetchStars();
  }, []);

  return (
    <Row className="gap-2 h-12 w-full flex px-4 items-center" id="nav_bar">
      <div className="">
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
      </div>
      <ThemeSwitch />
      <div className="flex gap-2 items-center">
        <Button
          variant="secondary"
          size="s"
          className="ml-2"
          prefixIcon={"github"}
          suffixIcon={<span>{stars !== null ? stars?.toString() : "..."}</span>}
        >
          Star on Github
        </Button>
      </div>
    </Row>
  );
};
