import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { ThemeSwitch } from "./theme-switch";
import { NavBar } from "./nav-bar";
import { Header } from "../header";

export const layoutProps = (): BaseLayoutProps => {
  return {
    nav: {
      enabled: true,
      title: <Header />,
      children: <NavBar />,
    },
    themeSwitch: {
      enabled: false,
      component: <NavBar />,
    },
  };
};
