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
  Route,
} from "lucide-react";
import { Column, Icon, Row, Text, type IconProps } from "@nuvix/ui/components";
import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "~/ui/glowing-effect";
import { cn } from "@nuvix/sui/lib/utils";

// export function FeaturesSection() {
//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.5 },
//     },
//     hover: {
//       scale: 1.02,
//       backgroundColor: "rgba(255, 165, 0, 0.08)",
//       transition: { duration: 0.2 },
//     },
//   };

//   const features = [
//     {
//       title: "Authentication",
//       description:
//         "Secure user authentication with social logins, multi-factor auth, and custom auth flows.",
//       icon: Shield,
//     },
//     {
//       title: "Database",
//       description:
//         "Fully managed database with real-time subscriptions, automatic backups, and native querying.",
//       icon: Database,
//     },
//     {
//       title: "Serverless Functions",
//       description:
//         "Deploy API endpoints with zero infrastructure management and automatic scaling.",
//       icon: Zap,
//     },
//     {
//       title: "Real-time Updates",
//       description:
//         "Build reactive applications with WebSockets and real-time database subscriptions.",
//       icon: Activity,
//     },
//     {
//       title: "Storage",
//       description: "Store and serve files with automatic CDN distribution and access control.",
//       icon: Server,
//     },
//     {
//       title: "Edge Functions",
//       description:
//         "Run your code at the edge locations closest to your users for low latency responses.",
//       icon: Globe,
//     },
//     {
//       title: "Multiple Runtimes",
//       description:
//         "Deploy in Node.js, Python, Go, or any language of your choice with custom runtimes.",
//       icon: Code,
//     },
//     {
//       title: "Scheduling",
//       description: "Schedule jobs and recurring tasks with precision timing and reliability.",
//       icon: Clock,
//     },
//   ];

//   return (


//       {/* <motion.div
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//         variants={containerVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//       >
//         {features.map((feature, index) => (
//           <motion.div
//             key={index}
//             className="p-6 border border-neutral-800 rounded-xl backdrop-blur-sm"
//             variants={itemVariants}
//             whileHover="hover"
//           >
//             <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
//               <feature.icon className="w-6 h-6 text-orange-400" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
//             <p className="text-neutral-400 mb-4">{feature.description}</p>
//             <div className="flex items-center text-orange-400 font-medium cursor-pointer group">
//               <span>Learn more</span>
//               <LucideArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
//             </div>
//           </motion.div>
//         ))}
//       </motion.div> */}
//       <GlowingEffectDemo />
//     </div>
//   );
// }

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
        />
        <GridItem
          area="col-span-1 md:col-span-4 md:row-span-1"
          icon="authentication"
          title="Authentication"
          description="Secure user authentication with social logins, multi-factor auth, and custom auth flows."
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
