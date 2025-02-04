"use client";
import { sdkForConsole } from "@/lib/sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ConsoleWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { account } = sdkForConsole;
  const { push } = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let user = await account.get();
        setIsLoading(false);
      } catch (e) {
        push("/auth/login");
      }
    };
    fetchUser();
  }, []);

  return <>{isLoading ? "IS LOADING" : children}</>;
};

export default ConsoleWrapper;
