import { Stack } from "@chakra-ui/react";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Stack
                direction={"row"}
                position="relative"
                as={"main"}
                gap={0}
            >
                {children}
            </Stack>
        </>
    );
}
