"use client";
import { Logo, Row, Button } from "@nuvix/ui/components";
import type React from "react";
import { UserProfile } from "../_profile";
import { FeedbackButton, HelpButton } from "../project/components";

const AccountHeader: React.FC = () => {
  return (
    <>
      <Row
        as="header"
        fillWidth
        zIndex={8}
        gap="12"
        padding="8"
        height="64"
        minHeight="64"
        background="neutral-medium"
        vertical="center"
        position="fixed"
        borderBottom="neutral-alpha-medium"
        top="0"
      >
        <Row marginLeft="8" marginRight="16">
          <Logo
            icon={false}
            size="l"
            className="is-only-dark"
            wordmarkSrc="/trademark/nuvix-logo-dark.svg"
          />
          <Logo
            icon={false}
            size="l"
            className="is-only-light"
            wordmarkSrc="/trademark/nuvix-logo-light.svg"
          />
        </Row>
        <Row fillWidth vertical="center" horizontal="space-between" marginLeft={"80"}>
          <Row fillWidth vertical="center" horizontal="end" gap="12">
            <div className="flex items-center gap-3">
              <FeedbackButton />
              <div className="flex items-center gap-0.5">
                <HelpButton />
                <Button size="s" variant="tertiary" href="https://docs.nuvix.in" target="_blank">
                  Docs
                </Button>
              </div>
            </div>
            <UserProfile />
          </Row>
        </Row>
      </Row>
    </>
  );
};

AccountHeader.displayName = "Header";

export { AccountHeader };
