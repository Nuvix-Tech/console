"use client";
import { ProjectSidebar } from "@/components/console/sidebar";
import { Row } from "@/once-ui/components";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Row gap="8" fill>
                <ProjectSidebar />
                {children}
            </Row>
        </>
    );
}
