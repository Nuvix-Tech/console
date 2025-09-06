import { Logo } from "@nuvix/ui/components";
import Link from "next/link";

export const Header = () => {
  return (
    <Link href="/" className="h-10 flex items-center">
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
  );
};
