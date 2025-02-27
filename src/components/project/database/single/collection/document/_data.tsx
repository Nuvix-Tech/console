"use client";

import { getDocumentPageState } from "@/state/page";

export const DocumentData = () => {
    const { document } = getDocumentPageState();
    if (!document) return;
    
    return (
        <>
            {JSON.stringify(document)}
            hello data
        </>
    )
}