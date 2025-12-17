"use client";

import { Column, Row, Text, Avatar, ToggleButton, Input, Chip } from "@nuvix/ui/components";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@nuvix/sui/lib/utils";

interface GridItemProps {
  area: string;
  title: string;
  description: React.ReactNode;
  info?: React.ReactNode;
  wide?: boolean;
  extra?: React.ReactNode;
}

const GridItem = ({ area, title, info, description, wide, extra }: GridItemProps) => {
  return (
    <li key={area} data-theme="dark" className={`list-none ${area} group cursor-default relative`}>
      <div className="relative h-full rounded-xs border neutral-border-strong md:rounded-sm neutral-background-medium">
        <div
          className={cn("relative flex flex-1 flex-col gap-3 px-2 pb-2 size-full", {
            "flex-row": wide,
          })}
        >
          <Column gap="4" className="relative z-10 pointer-events-none px-1.5 md:px-2 py-4">
            <Text variant="label-strong-m" onBackground="neutral-strong" as="h2">
              {title}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-medium" as="p">
              {description}
            </Text>
            {info}
          </Column>
          <div className="relative flex-1 h-full radius-s overflow-hidden p-2 py-4 w-full pointer-events-auto neutral-background-alpha-weak">
            {extra}
          </div>
        </div>
      </div>
    </li>
  );
};

const SessionManagement = () => {
  const sessions = [
    { device: "Macbook Pro", location: "New York, US" },
    { device: "iPhone 17", location: "London, UK" },
    { device: "iPad Air", location: "Tokyo, JP" },
  ];

  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      <AnimatePresence mode="popLayout">
        <Column background="surface" radius="s" gap="4" className="p-4 w-3/4">
          <Row vertical="center" gap="12" marginBottom="12">
            <Avatar />
            <Text variant="label-strong-m" onBackground="neutral-strong" as="h2">
              Arijit Singh
            </Text>
          </Row>
          <ToggleButton size="s" fillWidth horizontal="start" disabled>
            Overview
          </ToggleButton>
          <ToggleButton size="s" fillWidth horizontal="start" disabled>
            Memberships
          </ToggleButton>
          <ToggleButton size="s" fillWidth horizontal="start" selected>
            Sessions
          </ToggleButton>
          <ToggleButton size="s" fillWidth horizontal="start" disabled>
            Activity
          </ToggleButton>
        </Column>

        <Column
          background="info-weak"
          radius="s"
          gap="4"
          className="p-4 w-3/4 ml-auto -mt-4 z-10"
          border="neutral-medium"
        >
          <Row
            vertical="center"
            gap="12"
            horizontal="space-between"
            fillWidth
            borderBottom="neutral-weak"
            className="pb-2 px-1"
          >
            <Text variant="body-strong-xs" onBackground="neutral-strong" as="h5">
              Device
            </Text>
            <Text variant="body-strong-xs" onBackground="neutral-strong" as="h5">
              Location
            </Text>
          </Row>
          {sessions.map((s) => (
            <motion.div
              key={s.device}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between border-b neutral-border-weak px-3 py-2"
            >
              <div className="flex items-center gap-3 justify-start w-full flex-1">
                <Text variant="body-default-xs" onBackground="neutral-strong">
                  {s.device}
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-medium" className="ml-auto">
                  {s.location}
                </Text>
              </div>
            </motion.div>
          ))}
        </Column>
      </AnimatePresence>
    </div>
  );
};

const SecurePasswords = () => {
  return (
    <Column vertical="center" gap="4" fill paddingX="4">
      <Text variant="body-strong-s" onBackground="neutral-strong" as="p" marginBottom="4">
        Password
      </Text>
      <Input placeholder="Type password..." readOnly labelAsPlaceholder />
      <Column gap="4" className="mt-4">
        <Chip label="At least 8 characters" selected={false} prefixIcon="check" />
        <Chip label="Includes a number" selected={false} prefixIcon="check" />
        <Chip label="Includes a special character" selected={false} prefixIcon="check" />
        <Chip label="Includes an uppercase letter" selected={false} prefixIcon="check" />
        <Chip label="Includes a lowercase letter" selected={false} prefixIcon="check" />
        <Chip label="Avoids common passwords" selected={false} prefixIcon="check" />
      </Column>
    </Column>
  );
};

const SessionLimit = () => {
  return (
    <>
      <Column background="surface" radius="s" gap="4" className="p-4 h-16 mb-4 -mt-10" />
      <Column background="surface" radius="s" gap="4" className="p-4">
        <Row vertical="center" gap="4">
          <Column className="w-1/2">
            <Text variant="body-strong-s" onBackground="neutral-strong" as="p" marginBottom="4">
              Session Limit
            </Text>
            <Text variant="body-default-s" onBackground="neutral-medium" as="p" marginBottom="4">
              Set the maximum number of active sessions a single user can have at any given time.
            </Text>
          </Column>
          <Column className="flex-1">
            <Input value={"10"} readOnly labelAsPlaceholder />
          </Column>
        </Row>
      </Column>
    </>
  );
};

const MFAVisualCard = () => {
  return (
    <Row gap="4" fill vertical="center" horizontal="center">
      {[3, 5, 4, 9, "", ""].map((a, i) => (
        <div
          key={i}
          className="size-8 rounded-full flex items-center justify-center neutral-background-alpha-medium"
        >
          <Text variant="body-default-xs" onBackground="neutral-strong">
            {a}
          </Text>
        </div>
      ))}
    </Row>
  );
};

const RateLimitCard = () => {
  const attempts = [
    { success: true },
    { success: true },
    { success: false },
    { success: false },
    { success: false },
  ];

  return (
    <Column gap="4" fill vertical="center" horizontal="center">
      <Column gap="2" horizontal="center">
        <Row gap="2" vertical="center">
          {attempts.map((attempt, i) => (
            <div
              key={i}
              className={cn(
                "size-4 rounded-full transition-all",
                attempt.success
                  ? "bg-green-500/20 border border-green-500/40"
                  : "bg-red-500/20 border border-red-500/40",
              )}
            />
          ))}
        </Row>
        <Text variant="label-default-xs" onBackground="neutral-medium">
          Rate limited
        </Text>
      </Column>

      <Column gap="1" horizontal="center">
        <Text variant="heading-strong-xs" onBackground="neutral-strong">
          5/100
        </Text>
        <Text variant="body-default-xs" onBackground="neutral-medium">
          requests per minute
        </Text>
      </Column>
    </Column>
  );
};

export const SecurityFeatures = () => {
  return (
    <section className="w-full py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <Text variant="heading-strong-l" as="h2" className="mb-2">
              Robust Security, Effortless Protection
            </Text>
            <Text variant="body-default-m" onBackground="neutral-medium">
              Built-in industry-leading security features to safeguard your users and data with
              ease.
            </Text>
          </div>
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-10 md:grid-rows-2">
          <GridItem
            area="col-span-1 md:col-span-3 md:row-span-2"
            title="Session Management"
            description="Manage user sessions and devices with ease."
            extra={<SessionManagement />}
          />
          <GridItem
            area="col-span-1 md:col-span-4 md:row-span-1"
            title="Session Limit"
            description="Limit the number of sessions per user."
            extra={<SessionLimit />}
          />
          <GridItem
            area="col-span-1 md:col-span-3 md:row-span-2"
            title="Secure Passwords"
            description="Enforce strong password policies with complexity rules."
            extra={<SecurePasswords />}
          />

          <div className="col-span-1 md:col-span-4 md:row-span-1 grid grid-cols-2 gap-4">
            <GridItem
              area="col-span-1"
              title="MFA"
              description="Enhance account security with Time-based One-Time Passwords (TOTP)."
              extra={<MFAVisualCard />}
            />
            <GridItem
              area="col-span-1"
              title="Rate Limiting"
              description="Protect against brute force attacks."
              extra={<RateLimitCard />}
            />
          </div>
        </ul>
      </div>
    </section>
  );
};
