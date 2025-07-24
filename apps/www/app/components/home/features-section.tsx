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
        <Text as="h2" variant="heading-default-xl">
          Powerful Backend Features
        </Text>
        <Text as="p" variant="body-default-s">
          Everything you need to build modern applications without managing infrastructure
        </Text>
      </div>

      <motion.div
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
      </motion.div>
    </div>
  );
}
