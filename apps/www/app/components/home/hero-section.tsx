import { Spotlight } from "components/ui/spotlight-new";
import { HoverBorderGradient } from "components/ui/hover-border-gradient";
import { BackgroundGradient } from "components/ui/background-gradient";
import { TypewriterEffect } from "components/ui/typewriter-effect";
import { motion } from "motion/react";

export const HeroSection = () => {
  const words = [
    { text: "Built", className: "dark:text-orange-400" },
    { text: "for", className: "dark:text-blue-300" },
    { text: "Speed.", className: "dark:text-orange-500" },
  ];

  return (
    <div className="h-[40rem] w-full rounded-md flex flex-col items-center justify-center antialiased bg-grid relative overflow-hidden px-4">
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(30, 100%, 85%, .10) 0, hsla(30, 100%, 55%, .03) 50%, hsla(30, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(30, 100%, 85%, .08) 0, hsla(30, 100%, 55%, .04) 80%, transparent 100%)"
      />

      <div className="relative z-10 max-w-7xl w-full">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 text-sm font-medium">
              Trusted by 5,000+ developers
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center"
          >
            {/* <TypewriterEffect words={words} /> */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-orange-300 py-4">
              Built for Speed.
              <br className="hidden sm:block" />
              Designed for Scalability.
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 text-base sm:text-lg text-neutral-300 max-w-3xl mx-auto text-center"
          >
            Nuvix combines databases, auth, storage, real-time messaging, and functions into one
            unified API—engineered for speed, hardened for scale. Launch your backend in minutes
            with enterprise-grade performance and security built-in.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center"
          >
            <button
              className="relative overflow-hidden rounded-xl px-8 py-2.5 font-medium 
                       bg-gradient-to-r from-orange-500 to-amber-600 
                       before:absolute before:inset-0 before:bg-gradient-to-r 
                       before:from-amber-500 before:to-orange-600 before:opacity-0
                       before:transition-opacity before:duration-300 hover:before:opacity-100
                       shadow-[0_0_20px_rgba(246,173,85,0.3)] hover:shadow-[0_0_25px_rgba(246,173,85,0.5)]
                       transition-all duration-300 hover:scale-105 text-white"
            >
              Start Free
            </button>

            <HoverBorderGradient containerClassName="rounded-xl" className="px-8 py-2.5 rounded-xl">
              <span>Request a Demo</span>
            </HoverBorderGradient>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
