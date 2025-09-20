"use client";
import { Text, ToggleButton } from "@nuvix/ui/components";
import { MegaMenu } from "@nuvix/ui/modules";

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
                links: [
                  {
                    label: "Authentication",
                    href: "/products/authentication",
                    icon: "authentication",
                    description: "User auth with social, MFA, and custom flows.",
                  },
                  {
                    label: "Database",
                    href: "/products/database",
                    icon: "database",
                    description: "Managed Postgres with scaling and security.",
                  },
                  {
                    label: "Storage",
                    href: "/products/storage",
                    icon: "storage",
                    description: "File storage with CDN and access control.",
                  },
                  {
                    label: "Messaging",
                    href: "/products/messaging",
                    icon: "messaging",
                    description: "Email, push, and SMS in one platform.",
                  },
                ],
              },
              {
                links: [],
                component: (
                  <div className="flex flex-col gap-2 mt-auto">
                    <Text onBackground="neutral-weak" variant="label-default-s" className="mb-1">
                      COMPARE
                    </Text>
                    <ToggleButton
                      href="/alternatives/compare-supabase"
                      rel="noopener noreferrer"
                      className="neutral-on-background-medium"
                    >
                      Nuvix vs Supabase
                    </ToggleButton>
                    {/* <ToggleButton
                      href="/alternatives/compare-firebase"
                      rel="noopener noreferrer"
                      className="neutral-on-background-medium"
                    >
                      Nuvix vs Firebase
                    </ToggleButton> */}
                    <ToggleButton
                      href="/alternatives/compare-appwrite"
                      rel="noopener noreferrer"
                      className="neutral-on-background-medium"
                    >
                      Nuvix vs Appwrite
                    </ToggleButton>
                  </div>
                ),
              },
            ],
          },
          {
            id: "solutions",
            label: "Solutions",
            suffixIcon: "chevronDown",
            sections: [
              {
                title: "By Use Case",
                links: [
                  {
                    label: "SaaS Apps",
                    href: "/solutions/saas",
                    icon: "layers",
                    description: "Scalable backend for SaaS platforms.",
                  },
                  {
                    label: "Mobile Apps",
                    href: "/solutions/mobile",
                    icon: "devicePhoneMobile",
                    description: "Backend for iOS & Android apps.",
                  },
                ],
              },
              {
                title: "By Industry",
                links: [
                  {
                    label: "Startups",
                    href: "/solutions/startups",
                    icon: "rocketLaunch",
                    description: "Launch fast with low cost.",
                  },
                  {
                    label: "Enterprise",
                    href: "/solutions/enterprise",
                    icon: "buildingOffice",
                    description: "Compliance, scale, and integrations.",
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
                    label: "Developer Docs",
                    href: "https://docs.nuvix.in",
                    icon: "bookOpen",
                    description: "Guides and tutorials.",
                  },
                  // {
                  //   label: "API Reference",
                  //   href: "https://docs.nuvix.in/api",
                  //   icon: "codeBracket",
                  //   description: "Endpoints and SDKs.",
                  // },
                ],
              },
              {
                title: "Community",
                links: [
                  {
                    label: "Discord",
                    href: "https://discord.gg/nuvix",
                    icon: "discord",
                    description: "Join our dev community.",
                  },
                  {
                    label: "GitHub",
                    href: "https://github.com/nuvix-tech",
                    icon: "github",
                    description: "Track issues and features.",
                  },
                ],
              },
            ],
          },
          {
            id: "pricing",
            label: "Pricing",
            href: "/pricing",
          },
          {
            id: "docs",
            label: "Docs",
            href: "https://docs.nuvix.in",
          },
        ]}
      />
    </>
  );
}
