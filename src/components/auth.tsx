"use client";
import { sdkForConsole } from "@/lib/sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
        let user = await account.get();
        push("/console");
      } catch (e) {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return <>{isLoading ? "IS LOADING" : children}</>;
};

export default AuthWrapper;
