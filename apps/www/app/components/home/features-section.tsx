"use client";
import { motion } from "motion/react";
import {
  LucideArrowRight,
  Database,
  Shield,
  Zap,
  Clock,
  Server,
  Globe,
  Code,
  Activity,
} from "lucide-react";
import { Text } from "@nuvix/ui/components";
import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "~/ui/glowing-effect";

export function FeaturesSection() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(255, 165, 0, 0.08)",
      transition: { duration: 0.2 },
    },
  };

  const features = [
    {
      title: "Authentication",
      description:
        "Secure user authentication with social logins, multi-factor auth, and custom auth flows.",
      icon: Shield,
    },
    {
      title: "Database",
      description:
        "Fully managed database with real-time subscriptions, automatic backups, and native querying.",
      icon: Database,
    },
    {
      title: "Serverless Functions",
      description:
        "Deploy API endpoints with zero infrastructure management and automatic scaling.",
      icon: Zap,
    },
    {
      title: "Real-time Updates",
      description:
        "Build reactive applications with WebSockets and real-time database subscriptions.",
      icon: Activity,
    },
    {
      title: "Storage",
      description: "Store and serve files with automatic CDN distribution and access control.",
      icon: Server,
    },
    {
      title: "Edge Functions",
      description:
        "Run your code at the edge locations closest to your users for low latency responses.",
      icon: Globe,
    },
    {
      title: "Multiple Runtimes",
      description:
        "Deploy in Node.js, Python, Go, or any language of your choice with custom runtimes.",
      icon: Code,
    },
    {
      title: "Scheduling",
      description: "Schedule jobs and recurring tasks with precision timing and reliability.",
      icon: Clock,
    },
  ];

  return (
    <div className="py-24 container mx-auto">
      <div className="text-center mb-16">
        <Text as="h2" variant="display-default-l">
          All the products you need, <br /> in one platform
        </Text>
        <Text as="p" variant="body-default-s">
          Everything you need to build modern applications without managing infrastructure
        </Text>
      </div>

      {/* <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="p-6 border border-neutral-800 rounded-xl backdrop-blur-sm"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
            <p className="text-neutral-400 mb-4">{feature.description}</p>
            <div className="flex items-center text-orange-400 font-medium cursor-pointer group">
              <span>Learn more</span>
              <LucideArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </motion.div> */}
      <GlowingEffectDemo />
    </div>
  );
}

export function GlowingEffectDemo() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Box className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Do things the right way"
        description="Running out of copy so I'll write anything."
      />

      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Settings className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="The best AI code editor ever."
        description="Yes, it's true. I'm not even kidding. Ask my mom if you don't believe me."
      />

      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Lock className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="You should buy Aceternity UI Pro"
        description="It's the best money you'll ever spend"
      />

      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="This card is also built by Cursor"
        description="I'm not even kidding. Ask my mom if you don't believe me."
      />

      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Coming soon on Aceternity UI"
        description="I'm writing the code as I record this, no shit."
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">{icon}</div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
