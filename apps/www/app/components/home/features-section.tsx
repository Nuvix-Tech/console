"use client";
import { Route } from "lucide-react";
import { Column, GlitchFx, Icon, Row, Text, type IconProps } from "@nuvix/ui/components";
import { GlowingEffect } from "~/ui/glowing-effect";
import { cn } from "@nuvix/sui/lib/utils";
import { Authentication } from "./features/auth";
import { Storage } from "./features/storage";
import { Messaging } from "./features/messaging";
import { DataAPIs } from "./features/apis";
import { Vector } from "./features/vector";
import { Schemas } from "./features/schemas";

export function FeaturesSection() {
  return (
    <div className="pb-24 container mx-auto">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-10 md:grid-rows-3">
        {/* First row: two columns, first 60%, second 40% */}
        <GridItem
          area="col-span-1 md:col-span-6 md:row-span-1"
          icon="database"
          title="Postgres Database"
          description="Every project comes with a fully managed Postgres database."
          wide
          extra={
            <GlitchFx speed="slow">
              <img className="object-fit size-78" src="/images/services/postgre.svg" />
            </GlitchFx>
          }
        />
        <GridItem
          area="col-span-1 md:col-span-4 md:row-span-1"
          icon="authentication"
          title="Authentication"
          description="Secure user authentication with social logins, multi-factor auth, and custom auth flows."
          extra={<Authentication />}
        />

        {/* Second row: three columns, third is tall */}
        <GridItem
          area="col-span-1 md:col-span-3 md:row-start-2 md:row-span-1"
          icon="storage"
          title="Storage"
          description="Store and serve files with automatic CDN distribution and access control."
          extra={<Storage />}
        />
        <GridItem
          area="col-span-1 md:col-span-4 md:row-start-2 md:row-span-1"
          icon="messaging"
          title="Messaging"
          description="Set up a full-functioning messaging service that covers multiple channels under one unified platform"
          extra={<Messaging />}
        />
        <GridItem
          area="col-span-1 md:col-span-3 md:row-start-2 md:row-end-4"
          icon="nuvixSchemas"
          title="Flexible Schema Engine"
          description={<>Choose between <Text onBackground="neutral-strong">Document</Text>, <Text onBackground="neutral-strong">Managed</Text>, and <Text onBackground="neutral-strong">Unmanaged</Text> schemas - designed for full control, flexibility, and native PostgreSQL performance.</>}
          extra={<Schemas />}
        />

        {/* Third row: two more items in remaining space */}
        <GridItem
          area="col-span-1 md:col-span-4 md:row-start-3 md:row-span-1"
          icon={<Route className="size-4 neutral-on-background-weak" />}
          title="Data APIs"
          description="Instant ready-to-use Restful APIs."
          extra={<DataAPIs />}
        />
        <GridItem
          area="col-span-1 md:col-span-3 md:row-start-3 md:row-span-1"
          icon="sparkle"
          title="Vector"
          description="Integrate your favorite ML-models to store, index and search vector embeddings."
          extra={<Vector />}
        />
      </ul>
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: IconProps["name"];
  title: string;
  description: React.ReactNode;
  wide?: boolean;
  extra?: React.ReactNode;
}

const GridItem = ({ area, icon, title, description, wide, extra }: GridItemProps) => {
  return (
    <li className={`min-h-[24rem] list-none ${area}`}>
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
              <Row gap="8" vertical="center">
                <Icon name={icon} border="brand-alpha-weak" radius="l" className="p-2" />
                <Text variant="label-strong-m">{title}</Text>
              </Row>
              <Text variant="body-default-m" onBackground="neutral-weak">
                {description}
              </Text>
            </Column>
            {extra}
          </div>
        </div>
      </div>
    </li>
  );
};
