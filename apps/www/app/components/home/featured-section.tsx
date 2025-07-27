import { motion } from "motion/react";
import { Fade } from "@nuvix/ui/components";

export const FeaturedSection = () => {
  return (
    <div className="py-2 container mx-auto px-2 lg:px-0">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-row ">
          <div className="w-1/2 min-w-1/2">
          </div>
          <Fade to="right">
            <div className="relative rounded-md border md:rounded-3xl bg-muted">
              <div className="backdrop-blur-3xl p-0.5 md:p-1 rounded-sm md:rounded-md">
                <div className="rounded md:rounded-md overflow-hidden">
                  <img
                    src="/images/dashboard/hero_default.png"
                    alt="Nuvix Dashboard"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </motion.div>
    </div>
  );
};
