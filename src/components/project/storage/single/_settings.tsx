"use client";
import { PageContainer, PageHeading } from "@/components/others";
import {
  DeleteBucket,
  FileSecurity,
  MetaEnable,
  UpdateAllowedExt,
  UpdateBucketPermissions,
  UpdateName,
} from "./components";

export const BucketSettings = () => {
  return (
    <PageContainer>
      <PageHeading heading="Settings" description="Manage your bucket settings" />
      <MetaEnable />
      <UpdateName />
      <UpdateBucketPermissions />
      <FileSecurity />
      <UpdateAllowedExt />
      <DeleteBucket />
    </PageContainer>
  );
};
