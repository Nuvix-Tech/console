"use client";
import { motion } from "motion/react";
import {
  Route,
} from "lucide-react";
import { Button, Column, Icon, Input, PasswordInput, Row, Text, type IconProps } from "@nuvix/ui/components";
import { GlowingEffect } from "~/ui/glowing-effect";
import { cn } from "@nuvix/sui/lib/utils";

export function FeaturesSection() {
  return (
    <div className="py-24 container mx-auto">
      <div className="text-center mb-16">
        <Text as="h2" variant="display-default-l">
          All the products you need, <br /> in one platform
        </Text>
        <Text as="p" variant="body-default-m" onBackground="neutral-weak" className="mt-4">
          Everything you need to build modern applications without managing infrastructure
        </Text>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-10 md:grid-rows-3">
        {/* First row: two columns, first 60%, second 40% */}
        <GridItem
          area="col-span-1 md:col-span-6 md:row-span-1"
          icon="database"
          title="Postgres Database"
          description="Every project comes with a fully managed Postgres database."
          wide
          extra={<img className="object-fit size-78" src="/images/services/postgre.svg" />}
        />
        <GridItem
          area="col-span-1 md:col-span-4 md:row-span-1"
          icon="authentication"
          title="Authentication"
          description="Secure user authentication with social logins, multi-factor auth, and custom auth flows."
          extra={<AuthenticationImage />}
        />

        {/* Second row: three columns, third is tall */}
        <GridItem
          area="col-span-1 md:col-span-3 md:row-start-2 md:row-span-1"
          icon="storage"
          title="Storage"
          description="Store and serve files with automatic CDN distribution and access control."
        />
        <GridItem
          area="col-span-1 md:col-span-4 md:row-start-2 md:row-span-1"
          icon="messaging"
          title="Messaging"
          description="Set up a full-functioning messaging service that covers multiple channels under one unified platform"
        />
        <GridItem
          area="col-span-1 md:col-span-3 md:row-start-2 md:row-end-4"
          icon="code"
          title="Three Type Schemas"
          description="I'm writing the code as I record this, no shit."
        />

        {/* Third row: two more items in remaining space */}
        <GridItem
          area="col-span-1 md:col-span-4 md:row-start-3 md:row-span-1"
          icon={<Route className="size-4 neutral-on-background-weak" />}
          title="Data APIs"
          description="Instant ready-to-use Restful APIs."
        />
        <GridItem
          area="col-span-1 md:col-span-3 md:row-start-3 md:row-span-1"
          icon="sparkle"
          title="Vector"
          description="Integrate your favorite ML-models to store, index and search vector embeddings."
        />
      </ul>
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: IconProps['name'];
  title: string;
  description: React.ReactNode;
  wide?: boolean;
  extra?: React.ReactNode
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
          <div className={cn("relative flex flex-1 flex-col gap-3", {
            "flex-row": wide
          })}>
            <Column gap="16">
              <Row gap="8" vertical="center">
                <Icon name={icon} border="brand-alpha-weak" radius="l" className="p-2" />
                <Text variant="label-strong-m" >
                  {title}
                </Text>
              </Row>
              <Text variant="body-default-m" onBackground="neutral-weak" >
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


const AuthenticationImage = () => (
  <motion.div className="mx-auto w-78">
    <Column radius="l" borderWidth={2} border="accent-alpha-weak" className="h-48 p-2 gap-2 overflow-hidden -ml-5 mr-5" background="neutral-alpha-weak">
      <Input height="s" readOnly label="user@example.com" labelAsPlaceholder />
      <PasswordInput height="s" readOnly label="********" labelAsPlaceholder />
      <Button
        variant="primary"
        size="s"
        fillWidth
        className="mt-2"
      >
        Sign In
      </Button>
      <Row gap="4" vertical="center" className="text-xs">
        <Text onBackground="neutral-weak" className="mx-auto" variant="label-default-xs">OR</Text>
      </Row>
      <Button
        variant="secondary"
        size="s"
        className="mt-2 !absolute bottom-0 right-0 !bg-transparent backdrop-blur-md"
        prefixIcon="google"
        weight="default"
      >
        Sign in with google
      </Button>
    </Column>
  </motion.div>
);

const StorageImage = () => (
  <motion.div>

  </motion.div>
)
