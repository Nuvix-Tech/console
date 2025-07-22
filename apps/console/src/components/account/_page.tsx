"use client";

import { PageContainer } from "../others";
import { UpdateName, UpdateEmail, UpdatePassword, UpdateMfa, DeleteAccount } from "./components";

export const AccountPage = () => {
  return (
    <PageContainer>
      <UpdateName />
      <UpdateEmail />
      <UpdatePassword />
      <UpdateMfa />
      <DeleteAccount />
    </PageContainer>
  );
};
