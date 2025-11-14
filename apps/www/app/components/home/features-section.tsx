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
    <div className="pb-24 cont px-3">
      <ul
        data-theme="dark"
        className="grid grid-cols-1 gap-4 md:grid-cols-10 md:grid-rows-3 !p-8 page-background radius-xs"
      >
        {/* First row: two columns, first 60%, second 40% */}
        <GridItem
          area="col-span-1 md:col-span-6 md:row-span-1"
          icon="database"
          title="Postgres Database"
          description="A fully managed PostgreSQL database, ready out of the box."
          wide
          extra={
            <Mask
              x={100}
              y={-200}
              radius={238}
              className="!hidden md:!block neutral-on-background-weak"
            >
              <svg
                fill="none"
                viewBox="0 0 96 96"
                className="size-96"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="rgb(255,255,255)">
                  <path d="m66.4165 50.8896c2.2091 0 4-1.7908 4-4 0-2.2091-1.7909-4-4-4s-4 1.7909-4 4c0 2.2092 1.7909 4 4 4z" />
                  <path
                    clip-rule="evenodd"
                    d="m48.7136 70.6212-.0001-6.9542c2.0805.8761 4.2646 1.5547 6.5288 2.0121v12.1785c0 3.6451 2.9549 6.6 6.6 6.6h2.9772c10.2725 0 18.6-8.3275 18.6-18.6v-22.5857c0-16.8999-13.7001-30.6-30.6-30.6h-18.6881c-3.1569 0-5.7962 2.2165-6.4464 5.1781-3.2705-1.2455-6.8961-1.5437-9.3361-1.6006-3.6898-.086-6.2864 2.9836-6.2864 6.3261v32.0457c0 12.4817 10.1184 22.6 22.6 22.6h7.4511c3.6451 0 6.6-2.9549 6.6-6.6zm-30.4859-49.1732c3.0587.0713 6.8426.5664 9.3037 2.0787v8.2383c0 12.259 6.3755 23.029 15.9916 29.1751-.0063.0739-.0095.1487-.0095.2242l.0001 9.4569c0 .7732-.6268 1.4-1.4 1.4h-7.4511c-9.6097 0-17.4-7.7902-17.4-17.4v-32.0457c0-.3694.1395-.6681.3217-.859.1716-.1799.3846-.2745.6435-.2685zm43.9037 39.717h5.2845c1.4359 0 2.6 1.1641 2.6 2.6s-1.1641 2.6-2.6 2.6h-6.9736v11.4926c0 .7732.6268 1.4 1.4 1.4h2.9772c7.4006 0 13.4-5.9994 13.4-13.4v-22.5857c0-14.0281-11.372-25.4-25.4-25.4h-18.6881c-.7732 0-1.4.6268-1.4 1.4v12.4931c0 16.2372 13.1629 29.4 29.4 29.4z"
                    fill-rule="evenodd"
                  />
                </g>
              </svg>
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
          // link="/products/postgres"
        />
        <GridItem
          area="col-span-1 md:col-span-4 md:row-span-1"
          icon="authentication"
          title="Authentication"
          description="Effortless, secure auth with social logins, multi-factor authentication, and custom flows."
          extra={<Authentication />}
          // link="/products/auth"
        />

        {/* Second row: three columns, third is tall */}
        <GridItem
          area="col-span-1 md:col-span-3 md:row-start-2 md:row-span-1"
          icon="storage"
          title="Storage"
          description="Store and serve files with automatic CDN distribution and access control."
          extra={<Storage />}
          // link="/products/storage"
        />
        <GridItem
          area="col-span-1 md:col-span-4 md:row-start-2 md:row-span-1"
          icon="messaging"
          title="Messaging"
          description="Set up a full-functioning messaging service that covers multiple channels under one unified platform"
          extra={<Messaging />}
          // link="/products/messaging"
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
          // link="/products/schemas"
        />

        {/* Third row: two more items in remaining space */}
        <GridItem
          area="col-span-1 md:col-span-4 md:row-start-3 md:row-span-1"
          icon={<Route className="size-4 neutral-on-background-weak" />}
          title="Data APIs"
          description="Instantly available RESTful APIs for your data."
          extra={<DataAPIs />}
          // link="/docs"
        />
        <GridItem
          area="col-span-1 md:col-span-3 md:row-start-3 md:row-span-1"
          icon="sparkle"
          title="Vector"
          description="Power your AI features by storing, indexing, and searching vector embeddings seamlessly."
          extra={<Vector />}
          // link="/products/vector"
        />
      </ul>
      <div className="mt-4 px-2">
        <Text as="h3" variant="heading-default-xl" onBackground="neutral-weak">
          <Text onBackground="neutral-strong">Use what you need.</Text> Everything works better
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
      {/* <Link className="" to={link ?? "#"}> */}
      <div className="relative h-full rounded-2xl border neutral-border-weak p-2 md:rounded-3xl md:p-3">
        {/* <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        /> */}
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-lg p-6 md:p-6 neutral-background-alpha-weak">
          <div
            className={cn("relative flex flex-1 flex-col gap-3", {
              "flex-row": wide,
            })}
          >
            <Column gap="16">
              <Row gap="8" vertical="center" className="w-full">
                <Icon
                  name={icon}
                  border="accent-alpha-weak"
                  radius="l"
                  className="p-2"
                  onBackground="neutral-medium"
                />
                <Text variant="label-strong-m" onBackground="neutral-medium">
                  {title}
                </Text>
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
      {/* </Link> */}
    </li>
  );
};
