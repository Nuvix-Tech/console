"use client";

import { IS_PLATFORM } from "@/lib/constants";
import { PageContainer } from "../others";
import { UpdateName, UpdateEmail, UpdatePassword, UpdateMfa, DeleteAccount } from "./components";

export const AccountPage = () => {
  return (
    <PageContainer>
      <UpdateName />
      <UpdateEmail />
      <UpdatePassword />
      {/* <UpdateMfa /> */}
      {IS_PLATFORM && <DeleteAccount />}
    </PageContainer>
  );
};
