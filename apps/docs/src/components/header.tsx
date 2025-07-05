import { ColorModeButton } from "@nuvix/cui/color-mode";
import { Button, Icon, Input, Logo, Row } from "@nuvix/ui/components";
import Link from "next/link";

export const Header = () => {
  return (
    <Row
      height={"64"}
      padding="12"
      horizontal="start"
      borderBottom="surface"
      position="fixed"
      left="0"
      top="0"
      zIndex={1}
      fillWidth
      className="backdrop-blur"
    >
      <Link href="/" className="h-10 flex items-center w-[256px]">
        <Logo
          icon={false}
          size="m"
          className="is-only-light"
          iconSrc="/trademark/nuvix-logo-light.svg"
        />
        <Logo
          icon={false}
          size="m"
          className="is-only-dark"
          iconSrc="/trademark/nuvix-logo-dark.svg"
        />
      </Link>
      <div className="w-md">
        <Input
          hasSuffix={<Icon name="search" />}
          labelAsPlaceholder
          label="Search"
          height="s"
          className="w-full"
        />
      </div>
      <div className="flex gap-2 items-center ml-auto">
        <Button>Go to Console</Button>
        <ColorModeButton />
      </div>
    </Row>
  );
};
