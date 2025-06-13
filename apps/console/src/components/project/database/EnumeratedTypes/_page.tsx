"use client";

import { PageContainer, PageHeading } from "@/components/others";
import EnumeratedTypes from "./_list";

export const EnumeratedTypesPage = () => {
  return (
    <>
      <PageContainer>
        <PageHeading
          heading="Enumerated Types"
          description="Enumerated types are a way to define a set of named values in the database."
        />
        <EnumeratedTypes />
      </PageContainer>
    </>
  );
};
