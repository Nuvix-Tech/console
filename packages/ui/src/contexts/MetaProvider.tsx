"use client";

import { createContext, useContext } from "react";

export const MetaContext = createContext<{
  link: any;
  img: any;
  usePathname?: () => string;
  useRouter?: () => any;
}>({
  link: "a",
  img: "img",
});

export const MetaProvider = ({
  link,
  img,
  children,
  usePathname,
  useRouter,
}: {
  link: any;
  img: any;
  children: React.ReactNode;
  usePathname?: () => string;
  useRouter?: () => any;
}) => {
  return (
    <MetaContext.Provider
      value={{
        link,
        img,
        usePathname,
        useRouter,
      }}
    >
      {children}
    </MetaContext.Provider>
  );
};

export const useMeta = () => useContext(MetaContext);
