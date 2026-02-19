import { Column, IconButton, Row, Text, ToggleButton } from "@nuvix/ui/components";
import { Link } from "react-router";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div
      data-theme="dark"
      className="page-background !text-(--neutral-alpha-medium) relative overflow-hidden"
    >
      <div data-theme="light" className="page-background h-14 rounded-b-xl" />
      <Text
        variant="display-strong-xl"
        className="absolute z-10 !text-[6rem] sm:!text-[10rem] md:!text-[14rem] lg:!text-[18rem] !leading-[4rem] sm:!leading-[7rem] md:!leading-[10rem] lg:!leading-[12rem] left-1/2 -translate-x-1/2 bottom-0 opacity-10 select-none pointer-events-none"
      >
        Nuvix
      </Text>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-4 cont px-4 lg:px-7 pt-8 sm:pt-6 lg:pt-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to={"/"}>
            <img src={`/trademark/logo-dark.png`} width={120} alt="logo" />
          </Link>
        </div>
        <div>
          <FooterMenu
            title="Product"
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
              { label: "Documentation", href: "https://docs.nuvix.in" },
              { label: "Github", href: "https://github.com/nuvix-dev/nuvix" },
              { label: "Discord", href: "https://discord.gg/2fWv2T6RzK" },
            ]}
          />
        </div>
        <div>
          <FooterMenu
            title="Company"
            items={[
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
            ]}
          />
        </div>
      </div>
      <Row
        vertical="center"
        horizontal="space-between"
        className="flex-col sm:flex-row gap-4 cont py-6 sm:py-4 px-4 sm:px-7"
      >
        <Row gap="4" vertical="center">
          <Text size="s" onBackground="neutral-weak" className="text-center sm:text-left">
            © {year} Nuvix. All rights reserved.
          </Text>
        </Row>
        <Row gap="8" vertical="center">
          <IconButton icon="github" variant="secondary" href="https://github.com/nuvix-dev/nuvix" />
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
