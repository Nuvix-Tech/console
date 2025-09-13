import { Button, Fade, Icon } from "@nuvix/ui/components";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Spotlight } from "~/ui/spotlight-new";

export const HeroSection = () => {
  return (
    <div className="h-[40rem] mb-10 w-full rounded-md flex items-center justify-between antialiased bg-grid relative overflow-hidden px-12 ">
      <Spotlight duration={0} translateY={-480} xOffset={280} smallWidth={459} />

      <div className="relative max-w-3xl w-full flex justify-between">
        <div className="flex flex-col items-start justify-start space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-3 flex items-center gap-2 py-1 rounded-full border accent-border-weak accent-background-alpha-weak accent-on-background-medium text-sm font-medium">
              <Icon name="sparkle" size="s" /> Nuvix Beta is live — build your backend, your way.
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className=""
          >
            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-foreground to-orange-500 py-4">
              Start simple.
              <br className="hidden sm:block" />
              Scale your way.
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 text-base sm:text-lg neutral-on-background-medium max-w-2xl mx-auto leading-relaxed"
          >
            Nuvix is a flexible, Postgres-powered backend that adapts to any data shape. With
            built-in auth, storage, messaging, and APIs, you can launch faster and scale
            effortlessly.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center"
          >
            <Button href="https://console.nuvix.in" target="_blank" size="s" variant="primary">
              Start building
            </Button>
            <Button
              href="https://docs.nuvix.in"
              size="s"
              variant="secondary"
              suffixIcon={ArrowRight}
            >
              Read the docs
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="h-full relative w-xl">
        <Fade to="right" fill>
          <Fade to="bottom" fill>
            <img
              src={"/images/dashboard/hero_dark.png"}
              className="absolute min-w-3xl w-4xl right-0 z-50 bottom-0 -translate-y-30 translate-x-80 border-[8px] border-(--neutral-alpha-medium) rounded-[8px] overflow-hidden"
            />
          </Fade>
        </Fade>
      </div>
    </div>
  );
};
