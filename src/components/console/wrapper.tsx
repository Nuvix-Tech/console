"use client";
import { sdkForConsole } from "@/lib/sdk";
import { ConsoleContext, type ConsoleContextData } from "@/lib/store/console";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import LoadingUI from "../loading";
import { appState } from "@/state/app-state";

const ConsoleWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<Partial<ConsoleContextData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { account } = sdkForConsole;
  const { replace } = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        appState.user = user;
        setData((prev) => ({ ...prev, user }));
        setIsLoading(false);
      } catch (e) {
        replace("/auth/login");
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingUI />
      ) : (
        <ConsoleContext.Provider value={{ data, dispatch: setData }}>
          {children}
        </ConsoleContext.Provider>
      )}
    </>
  );
};

export default ConsoleWrapper;
