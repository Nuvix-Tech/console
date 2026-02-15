import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { ThemeSwitch } from "./theme-switch";
import { Header } from "../header";

export const layoutProps = (): BaseLayoutProps => {
  return {
    nav: {
      enabled: true,
      title: <Header />,
    },
    themeSwitch: {
      enabled: true,
      component: <ThemeSwitch />,
    },
    githubUrl: "https://github.com/nuvix-dev/nuvix",
  };
};
