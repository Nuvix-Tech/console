"use client";
import { sdkForConsole } from "@/lib/sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingUI from "../loading";

const ConsoleWrapper: React.FC<{ children: React.ReactNode, }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const { account } = sdkForConsole;
    const { push } = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let user = await account.get()
                setIsLoading(false)
            } catch (e) {
                push("/auth/login")
            }
        }
        fetchUser()
    }, [])

    return (
        <>
            {
                isLoading ? <LoadingUI /> : children
            }
        </>
    )
}

export default ConsoleWrapper;