import { IconButton, Logo, Row, Text } from "@nuvix/ui/components";
import { Link } from "react-router";
import { ThemeSelector } from "@nuvix/sui/components/ThemeSelector";
import { ColorModeButton } from "@nuvix/cui/color-mode";
import { DOCS_URL } from "~/lib/constants";

export const Footer = () => {
  const year = new Date().getFullYear();

  const footerMenu = [
    {
      title: "Product",
      children: [
        { label: "Database", to: "/products/database" },
        { label: "Auth", to: "/products/auth" },
        { label: "Storage", to: "/products/storage" },
        { label: "Messaging", to: "/products/messaging" },
      ],
    },
    {
      title: "Resources",
      children: [
        { label: "Documentation", to: DOCS_URL },
        { label: "Blog", to: "/blog" },
        { label: "Support", to: "/support" },
        { label: "Community", to: "/community" },
      ],
    },
    {
      title: "Company",
      children: [
        { label: "About", to: "/about" },
        { label: "Careers", to: "/careers" },
        { label: "Contact", to: "/contact" },
        { label: "Privacy", to: "/privacy" },
      ],
    },
  ];

  return (
    <div className="surface-background border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo
              icon={false}
              wordmark
              wordmarkSrc="/trademark/logo-light.svg"
              className="dark:!hidden !block"
            />
            <Logo
              icon={false}
              wordmark
              wordmarkSrc="/trademark/logo-dark.svg"
              className="!hidden dark:!block"
            />
            <div className="flex items-center gap-3">
              <IconButton icon="github" variant="secondary" href="https://github.com/Nuvix-Tech" />
              <IconButton icon="discord" variant="secondary" href="https://github.com/Nuvix-Tech" />
            </div>
          </div>

          {/* Dynamic Menu Items */}
          {footerMenu.map((section) => (
            <div key={section.title} className="!space-y-4">
              <Text variant="label-default-l" onBackground="neutral-weak" className="uppercase">
                {section.title}
              </Text>
              <div className="space-y-3 mt-4">
                {section.children.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="block text-sm neutral-on-background-medium hover:!text-(--neutral-on-background-strong)"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8">
          <Row vertical="center" horizontal="space-between" className="flex-col md:flex-row gap-4">
            <Row gap="4" vertical="center">
              <Text size="s" onBackground="neutral-weak">
                © {year} Nuvix. All rights reserved.
              </Text>
            </Row>
            <Row gap="8" vertical="center">
              <ThemeSelector />
              <ColorModeButton />
            </Row>
          </Row>
        </div>
      </div>
    </div>
  );
};
