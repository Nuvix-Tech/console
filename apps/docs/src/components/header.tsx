import { Logo } from "@nuvix/ui/components";

export const Header = () => {
  return (
    <div className="-mt-1">
      <Logo
        icon={false}
        size="s"
        className="dark:!hidden !block"
        wordmarkSrc="/trademark/logo-light.svg"
      />
      <Logo
        icon={false}
        size="s"
        className="!hidden dark:!block"
        wordmarkSrc="/trademark/logo-dark.svg"
      />
    </div>
  );
};
