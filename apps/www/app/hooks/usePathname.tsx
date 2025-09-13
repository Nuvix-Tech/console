import { useLocation } from "react-router";

export const usePathname = () => {
  const { pathname } = useLocation();

  return pathname;
};
