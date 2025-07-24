"use client";

import { createContext, useContext } from "react";

export const MetaContext = createContext<{
  link: any;
  img: any;
}>({
  link: "a",
  img: "img",
});

export const MetaProvider = ({
  link,
  img,
  children,
}: {
  link: any;
  img: any;
  children: React.ReactNode;
}) => {
  return (
    <MetaContext.Provider
      value={{
        link,
        img,
      }}
    >
      {" "}
      {children}{" "}
    </MetaContext.Provider>
  );
};

export const useMeta = () => useContext(MetaContext);
