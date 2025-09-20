import { Button, Fade } from "@nuvix/ui/components";
import { Spotlight } from "~/ui/spotlight-new";

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="h-[40rem] mb-10 w-full rounded-md container mx-auto flex items-center justify-between antialiased overflow-hidden px-4">
        <Spotlight duration={0} translateY={-480} xOffset={280} smallWidth={459} />

        <div className="relative lg:max-w-2xl w-full flex justify-between">
          <div className="flex flex-col items-start justify-start space-y-6">
            <span className="px-3 flex items-center gap-2 py-1 rounded-full border neutral-border-medium neutral-background-alpha-weak neutral-on-background-strong text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-(--brand-solid-medium) animate-pulse" />
              New: Nuvix is now open source!
            </span>

            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-foreground to-(--brand-solid-medium) py-4">
              Start simple.
              <br className="block" />
              Scale your way.
            </h1>

            <p className="mt-4 text-base sm:text-lg neutral-on-background-medium max-w-2xl mx-auto leading-relaxed">
              Nuvix is a flexible, Postgres-powered{" "}
              <strong className="accent-on-background-weak">open source</strong> backend that adapts
              to any data shape. With built-in auth, storage, messaging, and APIs, you can launch
              faster and scale effortlessly.
            </p>

            <div className="mt-6 flex flex-row gap-4 sm:gap-8 justify-center items-center">
              <Button
                href="https://github.com/Nuvix-Tech/nuvix"
                target="_blank"
                size="s"
                variant="primary"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
        <div className="h-full relative flex-1 hidden lg:flex items-center justify-center">
          <Fade to="right" fill blur={0.1}>
            <Fade to="bottom" fill blur={0.3}>
              <img
                src={"/images/dashboard/hero_dark.png"}
                className="absolute min-w-3xl w-4xl right-0 z-50 bottom-0 -translate-y-30 translate-x-60 border-[8px] border-(--neutral-alpha-medium) rounded-[8px] overflow-hidden"
              />
            </Fade>
          </Fade>
        </div>
      </div>
    </div>
  );
};
