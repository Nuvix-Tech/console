import { Text, ToggleButton } from "@nuvix/ui/components";
import { MegaMenu } from "@nuvix/ui/modules";
import { DOCS_URL } from "~/lib/constants";

export function NavMenu() {
  return (
    <>
      <MegaMenu
        className="!hidden md:!flex"
        menuGroups={[
          {
            id: "products",
            label: labelx("Products"),
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
              // {
              //   links: [],
              //   component: (
              //     <div className="flex flex-col gap-2 mt-auto">
              //       <Text onBackground="neutral-weak" variant="label-default-s" className="mb-1">
              //         COMPARE
              //       </Text>
              //       <ToggleButton
              //         href="/alternatives/compare-supabase"
              //         rel="noopener noreferrer"
              //         className="neutral-on-background-medium"
              //       >
              //         Nuvix vs Supabase
              //       </ToggleButton>
              //       {/* <ToggleButton
              //         href="/alternatives/compare-firebase"
              //         rel="noopener noreferrer"
              //         className="neutral-on-background-medium"
              //       >
              //         Nuvix vs Firebase
              //       </ToggleButton> */}
              //       <ToggleButton
              //         href="/alternatives/compare-appwrite"
              //         rel="noopener noreferrer"
              //         className="neutral-on-background-medium"
              //       >
              //         Nuvix vs Appwrite
              //       </ToggleButton>
              //     </div>
              //   ),
              // },
            ],
          },
          {
            id: "resources",
            label: labelx("Resources"),
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
                    href: "https://github.com/nuvix-dev",
                    icon: "github",
                    description: "Track issues and features.",
                  },
                ],
              },
            ],
          },
          {
            id: "docs",
            label: labelx("Docs"),
            href: DOCS_URL,
          },
          // {
          //   id: "pricing",
          //   label: "Pricing",
          //   href: "/pricing",
          // },
        ]}
      />
    </>
  );
}

const labelx = (s: string) => <Text variant="label-strong-l">{s}</Text>;
