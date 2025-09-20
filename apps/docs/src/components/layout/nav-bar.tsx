"use client";
import { Button, Row } from "@nuvix/ui/components";
import { ThemeSwitch } from "./theme-switch";
import { useEffect, useState } from "react";

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
    <Row className="gap-2" id="nav_bar">
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
