"use client";

import { Column, Row, Text, Icon } from "@nuvix/ui/components";
import { motion } from "motion/react";

const features = [
    {
        title: "Team Organization",
        description: "Group users into teams with hierarchical structures. Create unlimited teams and subteams for complex organizational needs.",
        icon: "team",
    },
    {
        title: "Role-Based Access",
        description: "Define custom roles with granular permissions. Control exactly what each team member can access and modify.",
        icon: "security",
    },
    {
        title: "Permission Management",
        description: "Fine-grained permission control at resource level. Assign read, write, update, and delete permissions individually.",
        icon: "key",
    },
];

export const UserManagement = () => {
    return (
        <div className="w-full py-32 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6">
                <Column gap="8" className="mb-20 text-center max-w-2xl mx-auto">
                    <Text variant="display-strong-xs" as="h2">
                        Manage Teams and Permissions with Ease
                    </Text>
                    <Text variant="body-default-m" onBackground="neutral-medium" as="p">
                        Organize users into teams and control access with role-based permissions.
                        From simple team structures to complex enterprise hierarchies.
                    </Text>
                </Column>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Column: Features */}
                    <Column gap="8">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                title={feature.title}
                                description={feature.description}
                                icon={feature.icon}
                                delay={index * 0.1}
                            />
                        ))}
                    </Column>

                    {/* Right Column: Dashboard visual */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative rounded-xl overflow-hidden shadow-2xl border neutral-border-weak bg-neutral-background-strong">
                            {/* Window Header */}
                            <div className="h-8 bg-neutral-background-subtle border-b neutral-border-weak flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                            </div>
                            <img
                                src="/images/dashboard/secure-perms.png"
                                alt="Nuvix Dashboard Team Management"
                                className="w-full h-auto"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

interface FeatureCardProps {
    title: string;
    description: string;
    icon: string;
    delay: number;
}

const FeatureCard = ({ title, description, icon, delay }: FeatureCardProps) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        className="group"
    >
        <Row gap="m" vertical="start">
            <div className="p-3 rounded-xl bg-brand-alpha-weak text-brand-solid-strong flex-shrink-0 group-hover:bg-brand-alpha-medium transition-colors">
                <Icon name={icon} size="m" />
            </div>
            <Column gap="s">
                <Text variant="heading-strong-s" as="h3">{title}</Text>
                <Text variant="body-default-s" onBackground="neutral-medium" as="p">
                    {description}
                </Text>
            </Column>
        </Row>
    </motion.div>
);
