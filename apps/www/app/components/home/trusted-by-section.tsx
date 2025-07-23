import { motion } from "framer-motion";

export const TrustedBySection = () => {
  // Animation variants for the heading
  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Animation variants for the logos
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: { scale: 1.1, transition: { duration: 0.2 } },
  };

  // Animation variants for testimonials
  const testimonialVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const testimonials = [
    {
      text: "Nuvix reduced our backend development time by 70% and allowed our team to focus on building features our customers love.",
      author: "Sarah Johnson",
      position: "CTO at TechStack",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    {
      text: "The real-time capabilities in Nuvix are game-changing. We built our entire real-time collaboration platform on it.",
      author: "Michael Chen",
      position: "Lead Developer, Collaboratio",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
      text: "Scaling was our biggest pain point until we found Nuvix. Now we handle millions of requests without breaking a sweat.",
      author: "Emily Rodriguez",
      position: "VP Engineering, ScaleUp Inc",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ];

  return (
    <section className="py-24 w-full bg-neutral-900/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Animated Heading */}
        <motion.div
          className="text-center"
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-semibold text-neutral-100 mb-2">
            Trusted by developers worldwide
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Join thousands of developers and companies building with Nuvix
          </p>
        </motion.div>

        {/* Animated Logos */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center items-center gap-12 opacity-80"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          {/* Note: These are placeholder logos. You'll need to add actual logo files to public/logos/ */}
          {["Airbnb", "Spotify", "Slack", "Shopify", "Uber", "Notion"].map((company, index) => (
            <motion.div
              key={index}
              className="flex items-center"
              variants={logoVariants}
              whileHover="hover"
            >
              <div className="h-10 md:h-12 bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent font-bold text-xl md:text-2xl">
                {company}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-neutral-600/50 p-6 rounded-xl border border-neutral-700 backdrop-blur-sm"
              variants={testimonialVariants}
            >
              <div className="text-neutral-300 mb-4">"{testimonial.text}"</div>
              <div className="flex items-center mt-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-orange-500"
                />
                <div>
                  <div className="text-white font-medium">{testimonial.author}</div>
                  <div className="text-neutral-400 text-sm">{testimonial.position}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
