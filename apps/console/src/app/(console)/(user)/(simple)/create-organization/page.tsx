import React from "react";
import { Metadata } from "next";
import { CreateOrgPage } from "@/components/console";
import { IS_PLATFORM } from "@/lib/constants";
import NuvixAlphaNotice from "@/components/console/alpha_placeholder";

export const metadata: Metadata = {
  title: "Create Organization",
  description: "Create a new organization",
};

export default function CreateOrganization() {
  if (!IS_PLATFORM) return null;

  return (
    <>
      <div className="my-6 px-4 md:px-0 container mx-auto">
        <NuvixAlphaNotice />
        {/* <CreateOrgPage /> */}
      </div>
    </>
  );
}
