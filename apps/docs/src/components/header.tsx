import { Logo } from "@nuvix/ui/components";

export const Header = () => {
  return (
    <>
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
    </>
  );
};
