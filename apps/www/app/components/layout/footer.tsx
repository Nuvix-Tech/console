import { Column, IconButton, Row, Text, ToggleButton } from "@nuvix/ui/components";
import { ColorModeButton } from "@nuvix/cui/color-mode";
import { StripedPattern } from "components/magicui/striped-pattern";
import { Link } from "react-router";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div
      data-theme="dark"
      className="page-background border-t border-border/40 relative !text-(--neutral-alpha-medium)"
    >
      {/* <StripedPattern className="stroke-[0.3] [stroke-dasharray:8,4]" /> */}
      <div className="grid grid-cols-4 gap-4 cont p-4">
        <div>
          <Link to={"/"}>
            <img src={`/trademark/logo-dark.png`} width={100} alt="logo" />
          </Link>
        </div>
        <div>
          <FooterMenu
            title="Products"
            items={[
              { label: "Database", href: "/products/database", prefixIcon: "database" },
              {
                label: "Authentication",
                href: "/products/authentication",
                prefixIcon: "authentication",
              },
              { label: "Storage", href: "/products/storage", prefixIcon: "storage" },
              { label: "Messaging", href: "/products/messaging", prefixIcon: "messaging" },
            ]}
          />
        </div>
        <div>
          <FooterMenu
            title="Resources"
            items={[
              { label: "Documentation", href: "/docs" },
              { label: "Tutorials", href: "/tutorials" },
              { label: "API Reference", href: "/api" },
              { label: "Support", href: "/support" },
            ]}
          />
        </div>
        <div>
          <FooterMenu
            title="Company"
            items={[
              { label: "About Us", href: "/about" },
              { label: "Careers", href: "/careers" },
              { label: "Blog", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ]}
          />
        </div>
      </div>
      <Row
        vertical="center"
        horizontal="space-between"
        className="flex-col md:flex-row gap-4 !container !mx-auto py-4"
      >
        <Row gap="4" vertical="center">
          <Text size="s" onBackground="neutral-weak">
            © {year} Nuvix. All rights reserved.
          </Text>
        </Row>
        <Row gap="8" vertical="center">
          <ColorModeButton />
          <IconButton
            icon="github"
            variant="secondary"
            href="https://github.com/Nuvix-Tech/nuvix"
          />
        </Row>
      </Row>
    </div>
  );
};

type FooterMenuProps = {
  title: string;
  items: React.ComponentProps<typeof ToggleButton>[];
};

const FooterMenu = ({ title, items }: FooterMenuProps) => {
  return (
    <div>
      <Text onBackground="neutral-weak" className="uppercase " variant="label-default-s">
        {title}
      </Text>
      <Column gap="2" className="mt-4">
        {items.map((item, idx) => (
          <ToggleButton key={idx} className="!text-(--neutral-on-background-medium)" {...item} />
        ))}
      </Column>
    </div>
  );
};
