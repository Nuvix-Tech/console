"use client";
import { sdkForConsole } from "@/lib/sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingUI from "../loading";
import { ConsoleContext, ConsoleContextData } from "@/lib/store/console";

const ConsoleWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<Partial<ConsoleContextData>>({})
  const [isLoading, setIsLoading] = useState(true);
  const { account } = sdkForConsole;
  const { push } = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let user = await account.get();
        setData((prev) => ({ ...prev, user }))
        setIsLoading(false);
      } catch (e) {
        push("/auth/login");
      }
    };
    fetchUser();
  }, []);

  return <>{isLoading ? <LoadingUI /> :
    <ConsoleContext.Provider value={{ data, dispatch: setData }}>
      {children}
    </ConsoleContext.Provider>
  }</>;
};

export default ConsoleWrapper;
