"use client";
import React from "react";
import { Button, Icon, IconButton } from "../components";

const CACHE_KEY = "github_stars_nuvix";
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

export const GithubButton = () => {
  const [stars, setStars] = React.useState<number | null>(null);

  React.useEffect(() => {
    const fetchStars = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { stars: cachedStars, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setStars(cachedStars);
            return;
          }
        }

        // Fetch fresh data
        const response = await fetch("https://api.github.com/repos/nuvix-tech/nuvix");
        const data = await response.json();
        const starCount = data.stargazers_count;
        setStars(starCount);

        // Cache the result
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            stars: starCount,
            timestamp: Date.now(),
          }),
        );
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
      className="ml-2 relative"
      href="https://www.github.com/nuvix-tech/nuvix"
      prefixIcon="github"
      suffixIcon={<div>{stars !== null ? stars?.toString() : "..."}</div>}
    >
      Star on Github
    </Button>
  );
};
