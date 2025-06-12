"use client";

import { PageContainer, PageHeading } from "@/components/others";
import FunctionsList from "./_list";

export const FunctionsPage = () => {
  return (
    <>
      <PageContainer>
        <PageHeading
          heading="Functions"
          description="Functions are reusable blocks of code that can be executed to perform specific tasks within the database."
        />
        <FunctionsList
          createFunction={() => {}}
          editFunction={() => {}}
          deleteFunction={() => {}}
        />
      </PageContainer>
    </>
  );
};
