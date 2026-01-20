"use client";
import { sdkForConsole } from "@/lib/sdk";
import { useRouter } from "@bprogress/next";
import type React from "react";
import { useEffect, useState } from "react";
import LoadingUI from "../loading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useApp } from "@/lib/store";
import { WizardProvider } from "../wizard/provider";
import { IS_PLATFORM } from "@/lib/constants";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 0,
    },
  },
});

const ConsoleWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { account, projects } = sdkForConsole;
  const { replace } = useRouter();
  const { setUser } = useApp((state) => state);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUser(user);
        if (!IS_PLATFORM) {
          const { data } = await projects.list();
          if (data.length < 1) throw new Error("Server Setup failed");
          replace(`/project/${data[0].$id}`);
        }
        setIsLoading(false);
      } catch (e) {
        replace("/auth/login");
      }
    };
    fetchUser();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WizardProvider>{isLoading ? <LoadingUI /> : children}</WizardProvider>
    </QueryClientProvider>
  );
};

export default ConsoleWrapper;
