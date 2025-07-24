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
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Products</NavigationMenuTrigger>
          <NavigationMenuContent className="neutral-background-medium">
            <ul className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-slate-900/80 to-slate-950 p-6 no-underline outline-none focus:shadow-md border border-slate-800"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium text-white">
                      Backend as a Service
                    </div>
                    <p className="text-sm leading-tight text-neutral-300">
                      Nuvix provides all the backend services you need to build modern applications
                      without infrastructure headaches.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/products" title="Overview">
                Explore all our backend services and how they work together
              </ListItem>
              <ListItem href="/pricing" title="Pricing">
                Simple, transparent pricing with generous free tier
              </ListItem>
              <ListItem href="/customers" title="Case Studies">
                See how companies are scaling with Nuvix
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/pricing">
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/docs">
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
              Docs
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
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
