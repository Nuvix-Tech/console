"use client";

import { PageContainer, PageHeading } from "@/components/others";
import Indexes from "./_list";
import { DocsButton } from "@/ui/DocsButton";
import { Button } from "@nuvix/ui/components";
import { ExternalLink } from "lucide-react";

export const IndexesPage = () => {
    return (
        <>
            <PageContainer>
                <PageHeading
                    heading="Database Indexes"
                    description="Improve query performance against your database."
                    right={
                        <div className="flex items-center gap-2">
                            <DocsButton
                                className="no-underline"
                                href="https://supabase.com/docs/guides/database/query-optimization"
                            />
                            <Button
                                prefixIcon={<ExternalLink size={20} strokeWidth={1.5} />}
                                rel="noreferrer"
                                href="https://supabase.com/docs/guides/database/extensions/index_advisor"
                            >
                                Index Advisor
                            </Button>
                        </div>
                    }
                />
                <Indexes />
            </PageContainer>
        </>
    );
};
