import { AccountHeader } from "@/components/account";
import { Stack } from "@chakra-ui/react";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AccountHeader />
            <Stack
                direction={"row"}
                position="relative"
                as={"main"}
                gap={0}
                className="mt-16 max-w-6xl w-full mx-auto py-4 px-2"
            >
                {children}
            </Stack>
        </>
    );
}
