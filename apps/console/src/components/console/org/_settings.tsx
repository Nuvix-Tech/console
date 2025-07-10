"use client";
import { PageContainer, PageHeading } from "@/components/others";
import { Column } from "@nuvix/ui/components";
import { UpdateName } from "./components/_update_name";
import { DeleteOrg } from "./components/_delete_org";

export const SettingsPage = () => {
  return (
    <>
      <PageContainer>
        <PageHeading heading="Settings" />

        <Column fillWidth gap="16">
          <UpdateName />
          <DeleteOrg />
        </Column>
      </PageContainer>
    </>
  );
};
