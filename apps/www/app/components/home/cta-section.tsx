import { motion } from "framer-motion";
import { TypewriterEffect } from "components/ui/typewriter-effect";

export const CtaSection = () => {
  const words = [
    {
      text: "Ready",
    },
    {
      text: "to",
    },
    {
      text: "transform",
    },
    {
      text: "your",
    },
    {
      text: "backend",
      className: "text-orange-500",
    },
    {
      text: "development?",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-neutral-900/20 to-neutral-950">
      {/* <BackgroundGradient
                className="absolute inset-0 bg-grid z-0"
                containerClassName="absolute inset-0"
            // colors={["rgba(255, 165, 0, 0.2)", "rgba(0, 0, 0, 0)"]}
            /> */}

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 mx-auto"
          >
            <TypewriterEffect words={words} className="text-4xl md:text-5xl font-bold" />
          </motion.div>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-neutral-300 mb-10 mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Join thousands of developers who are building faster and scaling with confidence using
            Nuvix.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <button className="px-8 py-4 bg-orange-500 rounded-full text-white font-medium hover:bg-orange-600 transition-colors">
              Start Building for Free
            </button>
            <button className="px-8 py-4 border border-neutral-700 rounded-full text-neutral-200 font-medium hover:bg-white/5 transition-colors">
              Schedule a Demo
            </button>
          </motion.div>

          <motion.div
            className="mt-12 bg-gray-900/70 backdrop-blur-md p-6 rounded-lg border border-gray-800 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h3 className="text-lg font-medium text-white mb-4">
              Ready to get started in minutes?
            </h3>
            <div className="bg-gray-950 p-4 rounded-md font-mono text-sm text-neutral-300">
              <div>
                <span className="text-blue-400">$</span> <span className="text-green-400">npm</span>{" "}
                install nuvix
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-400">
              Our extensive documentation and tutorials will help you get up and running quickly.
              <a href="#" className="ml-2 text-orange-400 hover:underline">
                View Documentation →
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
