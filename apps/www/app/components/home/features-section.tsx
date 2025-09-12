"use client";
import { Route } from "lucide-react";
import { Column, GlitchFx, Icon, Mask, Row, Text, type IconProps } from "@nuvix/ui/components";
import { GlowingEffect } from "~/ui/glowing-effect";
import { cn } from "@nuvix/sui/lib/utils";
import { Authentication } from "./features/auth";
import { Storage } from "./features/storage";
import { Messaging } from "./features/messaging";
import { DataAPIs } from "./features/apis";
import { Vector } from "./features/vector";
import { Schemas } from "./features/schemas";
import { Link } from "react-router";
import type React from "react";

export function FeaturesSection() {
  return (
    <div className="pb-24 container mx-auto px-4">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-10 md:grid-rows-3 !p-0">
        {/* First row: two columns, first 60%, second 40% */}
        <GridItem
          area="col-span-1 md:col-span-6 md:row-span-1"
          icon="database"
          title="Postgres Database"
          description="A fully managed PostgreSQL database, ready out of the box."
          wide
          extra={
            <Mask x={10} y={-200} radius={138} className="!hidden md:!block">
              <img className="object-fit size-78 mx-auto" src="/images/services/postgre.png" />
            </Mask>
          }
          info={
            <Column className="mt-auto">
              {["PostgreSQL at the core", "Easy to extend", "Secure by default"].map((feature) => (
                <Row key={feature} gap="8" vertical="center">
                  <Icon name="check" size="xs" onBackground="neutral-medium" />
                  <Text variant="body-default-s" onBackground="neutral-medium">
                    {feature}
                  </Text>
                </Row>
              ))}
            </Column>
          }
          link="/products/postgres"
        />
        <GridItem
          area="col-span-1 md:col-span-4 md:row-span-1"
          icon="authentication"
          title="Authentication"
          description="Effortless, secure auth with social logins, multi-factor authentication, and custom flows."
          extra={<Authentication />}
          link="/products/auth"
        />

        {/* Second row: three columns, third is tall */}
        <GridItem
          area="col-span-1 md:col-span-3 md:row-start-2 md:row-span-1"
          icon="storage"
          title="Storage"
          description="Store and serve files with automatic CDN distribution and access control."
          extra={<Storage />}
          link="/products/storage"
        />
        <GridItem
          area="col-span-1 md:col-span-4 md:row-start-2 md:row-span-1"
          icon="messaging"
          title="Messaging"
          description="Set up a full-functioning messaging service that covers multiple channels under one unified platform"
          extra={<Messaging />}
          link="/products/messaging"
        />
        <GridItem
          area="col-span-1 md:col-span-3 md:row-start-2 md:row-end-4"
          icon="nuvixSchemas"
          title="Flexible Schema Engine"
          description={
            <>
              Choose between <Text onBackground="neutral-strong">Document</Text>,{" "}
              <Text onBackground="neutral-strong">Managed</Text>, and{" "}
              <Text onBackground="neutral-strong">Unmanaged</Text> schemas - designed for full
              control, flexibility, and native PostgreSQL performance.
            </>
          }
          extra={<Schemas />}
          link="/products/schemas"
        />

        {/* Third row: two more items in remaining space */}
        <GridItem
          area="col-span-1 md:col-span-4 md:row-start-3 md:row-span-1"
          icon={<Route className="size-4 neutral-on-background-weak" />}
          title="Data APIs"
          description="Instantly available RESTful APIs for your data."
          extra={<DataAPIs />}
          link="/docs"
        />
        <GridItem
          area="col-span-1 md:col-span-3 md:row-start-3 md:row-span-1"
          icon="sparkle"
          title="Vector"
          description="Power your AI features by storing, indexing, and searching vector embeddings seamlessly."
          extra={<Vector />}
          link="/products/vector"
        />
      </ul>
      <div className="mt-4 px-2">
        <Text as="h3" variant="heading-default-xl" onBackground="neutral-weak">
          <Text onBackground="neutral-medium">Use what you need.</Text> Everything works better
          together.
        </Text>
      </div>
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: IconProps["name"];
  title: string;
  description: React.ReactNode;
  info?: React.ReactNode;
  wide?: boolean;
  extra?: React.ReactNode;
  link?: string;
}

const GridItem = ({ area, icon, title, info, link, description, wide, extra }: GridItemProps) => {
  return (
    <li className={`min-h-[24rem] list-none ${area} group`}>
      <Link className="" to={link ?? "#"}>
        <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-lg p-6 md:p-6 neutral-background-alpha-weak">
            <div
              className={cn("relative flex flex-1 flex-col gap-3", {
                "flex-row": wide,
              })}
            >
              <Column gap="16">
                <Row gap="8" vertical="center" className="w-full">
                  <Icon name={icon} border="brand-alpha-weak" radius="l" className="p-2" />
                  <Text variant="label-strong-m">{title}</Text>
                </Row>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  {description}
                </Text>
                {info}
              </Column>
              {extra}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};
