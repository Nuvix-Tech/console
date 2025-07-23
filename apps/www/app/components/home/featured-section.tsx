import { GlowingEffect } from "components/ui/glowing-effect";
import { motion } from "framer-motion";

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
        <div className="relative rounded-md border md:rounded-3xl bg-slate-200/10">
          <div className="backdrop-blur-3xl p-2 md:p-3 rounded-md md:rounded-3xl">
            <GlowingEffect
              blur={0}
              borderWidth={3}
              spread={90}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="rounded md:rounded-[12px] overflow-hidden">
              <img src="/assets/dashboard.png" alt="Nuvix Dashboard" className="w-full" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
