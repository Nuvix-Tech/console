"use client";
import React from "react";
import { Button } from "../components";

export const GithubButton = () => {
  const [stars, setStars] = React.useState<number | null>(null);

  React.useEffect(() => {
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
    <Button
      variant="secondary"
      size="s"
      className="ml-2"
      prefixIcon={"github"}
      suffixIcon={<span>{stars !== null ? stars?.toString() : "..."}</span>}
      href="https://www.github.com/nuvix-tech/nuvix"
    >
      Star on Github
    </Button>
  );
};
