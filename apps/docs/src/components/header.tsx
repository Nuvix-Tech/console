import { Logo } from "@nuvix/ui/components";

export const Header = () => {
  return (
    <>
      <Logo
        icon={false}
        size="m"
        className="dark:!hidden !block"
        wordmarkSrc="/trademark/logo-light.svg"
      />
      <Logo
        icon={false}
        size="m"
        className="!hidden dark:!block"
        wordmarkSrc="/trademark/logo-dark.svg"
      />
    </>
  );
};
