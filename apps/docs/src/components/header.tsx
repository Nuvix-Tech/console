import { Logo } from "@nuvix/ui/components";

export const Header = () => {
  return (
    <>
      <Logo icon={false} size="m" className="is-only-light" iconSrc="/trademark/logo-light.svg" />
      <Logo icon={false} size="m" className="is-only-dark" iconSrc="/trademark/logo-dark.svg" />
    </>
  );
};
