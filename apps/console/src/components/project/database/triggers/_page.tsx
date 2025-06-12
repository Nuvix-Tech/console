"use client";

import { PageContainer, PageHeading } from "@/components/others";
import TriggersList from "./_list";

export const TriggersPage = () => {
  return (
    <>
      <PageContainer>
        <PageHeading
          heading="Triggers"
          description="Triggers are special database objects that automatically execute a specified function in response to certain events on a table, such as INSERT, UPDATE, or DELETE."
        />
        <TriggersList createTrigger={() => {}} editTrigger={() => {}} deleteTrigger={() => {}} />
      </PageContainer>
    </>
  );
};
