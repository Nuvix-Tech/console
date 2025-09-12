"use client";

import * as React from "react";
import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@nuvix/sui/components/navigation-menu";
import { cn } from "@nuvix/sui/lib/utils";
import { MegaMenu } from "@nuvix/ui/modules"

const products = [
  {
    title: "Authentication",
    href: "/products/authentication",
    description:
      "Secure user authentication with social logins, multi-factor auth, and custom auth flows.",
  },
  {
    title: "Database",
    href: "/products/database",
    description:
      "Fully managed database with real-time subscriptions, automatic backups, and native querying.",
  },
  {
    title: "Serverless Functions",
    href: "/products/functions",
    description: "Deploy API endpoints with zero infrastructure management and automatic scaling.",
  },
  {
    title: "Storage",
    href: "/products/storage",
    description: "Store and serve files with automatic CDN distribution and access control.",
  },
  {
    title: "Edge Computing",
    href: "/products/edge",
    description:
      "Run your code at the edge locations closest to your users for low latency responses.",
  },
  {
    title: "Real-time",
    href: "/products/realtime",
    description:
      "Build reactive applications with WebSockets and real-time database subscriptions.",
  },
];

export function NavMenu() {
  return (
    <>
      <MegaMenu
        menuGroups={[
          {
            id: "products",
            label: "Products",
            suffixIcon: "chevronDown",
            sections: [
              {
                title: "Featured",
                links: [
                  {
                    label: "Analytics",
                    href: "/analytics",
                    icon: "HiOutlineDocumentChartBar",
                    description: "Get insights into your data",
                  },
                  {
                    label: "Security",
                    href: "/security",
                    icon: "HiOutlineShieldCheck",
                    description: "Protect your assets",
                  },
                ],
              },
              {
                title: "Tools",
                links: [
                  {
                    label: "Dashboard",
                    href: "/dashboard",
                    icon: "HiOutlineSquares2X2",
                    description: "Monitor your metrics",
                  },
                  {
                    label: "Settings",
                    href: "/settings",
                    icon: "HiCog8Tooth",
                    description: "Configure your preferences",
                  },
                ],
              },
            ],
          },
          {
            id: "solutions",
            label: "Solutions",
            suffixIcon: "chevronDown",
            sections: [
              {
                title: "By industry",
                links: [
                  {
                    label: "Enterprise",
                    href: "/enterprise",
                    icon: "cube",
                    description: "Solutions for large organizations",
                  },
                  {
                    label: "Startups",
                    href: "/startups",
                    icon: "rocket",
                    description: "Perfect for growing companies",
                  },
                ],
              },
              {
                title: "By team",
                links: [
                  {
                    label: "Developers",
                    href: "/developers",
                    icon: "code",
                    description: "Tools and APIs",
                  },
                  {
                    label: "Design teams",
                    href: "/design",
                    icon: "sparkle",
                    description: "Creative solutions",
                  },
                ],
              },
            ],
          },
          {
            id: "resources",
            label: "Resources",
            suffixIcon: "chevronDown",
            sections: [
              {
                title: "Documentation",
                links: [
                  {
                    label: "Guides",
                    href: "/guides",
                    icon: "book",
                    description: "Learn how to use our platform",
                  },
                  {
                    label: "API reference",
                    href: "/api",
                    icon: "code",
                    description: "Technical documentation",
                  },
                ],
              },
              {
                title: "Support",
                links: [
                  {
                    label: "Help center",
                    href: "/help",
                    icon: "infoCircle",
                    description: "Get your questions answered",
                  },
                  {
                    label: "Community",
                    href: "/community",
                    icon: "people",
                    description: "Connect with other users",
                  },
                ],
              },
            ],
          },
          {
            id: "company",
            label: "Company",
            suffixIcon: "chevronDown",
            sections: [
              {
                title: "About",
                links: [
                  {
                    label: "Our story",
                    href: "/about",
                    icon: "book",
                    description: "Learn about our journey",
                  },
                  {
                    label: "Careers",
                    href: "/careers",
                    icon: "rocket",
                    description: "Join our team",
                  },
                ],
              },
              {
                title: "Connect",
                links: [
                  {
                    label: "Blog",
                    href: "/blog",
                    icon: "document",
                    description: "Latest updates and news",
                  },
                  {
                    label: "Contact",
                    href: "/contact",
                    icon: "email",
                    description: "Get in touch with us",
                  },
                ],
              },
            ],
          },
        ]}
      />
    </>
  );
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
