import { motion } from "motion/react";
import { Check, HelpCircle } from "lucide-react";
import { Tooltip } from "@nuvix/sui/components/tooltip";

export const PricingSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  const tiers = [
    {
      name: "Free",
      description: "Perfect for side projects and learning",
      price: "$0",
      period: "/month",
      features: [
        "Unlimited API requests",
        "10,000 database reads",
        "5,000 database writes",
        "1GB storage",
        "2 serverless functions",
        "Shared compute resources",
        "Community support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "For production applications and growing teams",
      price: "$49",
      period: "/month",
      features: [
        "Unlimited API requests",
        "1,000,000 database reads",
        "500,000 database writes",
        "100GB storage",
        "100 serverless functions",
        "Dedicated resources",
        "Real-time database",
        "Priority support",
        "Multi-region deployment",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large-scale applications and organizations",
      price: "Custom",
      period: "",
      features: [
        "Unlimited everything",
        "99.99% SLA",
        "Dedicated infrastructure",
        "VPC deployment",
        "24/7 premium support",
        "Custom integrations",
        "Enterprise SSO",
        "Compliance certifications",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 container mx-auto">
      <div className="text-center mb-16">
        <motion.h2
          className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-orange-300"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Simple, Transparent Pricing
        </motion.h2>
        <motion.p
          className="max-w-2xl mx-auto text-lg text-neutral-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Start for free, scale as you grow. No hidden fees or surprises.
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {tiers.map((tier, index) => (
          <motion.div
            key={index}
            className={`p-8 rounded-xl border ${
              tier.popular
                ? "border-orange-500 bg-gradient-to-b from-orange-950/20 to-transparent"
                : "border-neutral-700 bg-neutral-900/50"
            } backdrop-blur-sm relative`}
            variants={itemVariants}
            whileHover="hover"
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}

            <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
            <p className="text-neutral-400 mb-6 h-12">{tier.description}</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">{tier.price}</span>
              <span className="text-neutral-400">{tier.period}</span>
            </div>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="min-w-4 h-4 text-green-500 mr-2 mt-1" />
                  <span className="text-neutral-300">{feature}</span>
                  {/* {feature.includes("SLA") && (
                    <Tooltip content="Service Level Agreement guaranteeing uptime">
                      <HelpCircle className="w-4 h-4 text-neutral-400 ml-1 cursor-help" />
                    </Tooltip>
                  )} */}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                tier.popular
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {tier.cta}
            </button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-16 p-6 border border-dashed border-neutral-700 rounded-xl text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="text-neutral-300">
          Need a custom solution?{" "}
          <a href="#" className="text-orange-400 hover:underline">
            Contact our sales team
          </a>{" "}
          for personalized pricing.
        </p>
      </motion.div>
    </section>
  );
};
