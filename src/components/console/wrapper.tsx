"use client";
import { sdkForConsole } from "@/lib/sdk";
import { useRouter } from "@bprogress/next";
import type React from "react";
import { useEffect, useState } from "react";
import LoadingUI from "../loading";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useApp } from "@/lib/store";

const queryClient = new QueryClient();

const ConsoleWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { account } = sdkForConsole;
  const { replace } = useRouter();
  const { setUser } = useApp()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUser(user);
        setIsLoading(false);
      } catch (e) {
        replace("/auth/login");
      }
    };
    fetchUser();
  }, []);

  console.log("🔥 SOMETHIN IN CONSOLE WRAPPER");

  return (
    <QueryClientProvider client={queryClient}>
      {isLoading ? <LoadingUI /> : children}
    </QueryClientProvider>
  );
};

export default ConsoleWrapper;
