"use client";
import { sdkForConsole } from "@/lib/sdk";
import { useRouter } from "@bprogress/next";
import type React from "react";
import { useEffect, useState } from "react";
import LoadingUI from "./loading";

const AuthWrapper: React.FC<{ children: React.ReactNode; isConsole?: boolean }> = ({
  children,
  isConsole = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { account } = sdkForConsole;
  const { push } = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        push("/");
      } catch (e) {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return <>{isLoading ? <LoadingUI /> : children}</>;
};

export default AuthWrapper;
