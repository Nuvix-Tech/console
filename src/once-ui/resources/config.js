import { APP_NAME } from "@/lib/constants";

const baseURL = "demo.once-ui.com";

// default customization applied to the HTML in the main layout.tsx
const style = {
  theme: "dark", // dark | light
  neutral: "slate", // sand | gray | slate
  brand: "yellow", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  accent: "aqua", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  solid: "contrast", // color | contrast | inverse
  solidStyle: "plastic", // flat | plastic
  border: "playful", // rounded | playful | conservative
  surface: "translucent", // filled | translucent
  transition: "all", // all | micro | macro
  scaling: "100", // 90 | 95 | 100 | 105 | 110
};

// default metadata
const meta = {
  title: `${APP_NAME}`,
  description: "A design system for Next.js",
};

// default open graph data
const og = {
  title: "Once UI for Next.js",
  description: "We let designers code and developers design.",
  type: "website",
  image: "/images/cover.jpg",
};

// default schema data
const schema = {
  logo: "",
  type: "Organization",
  name: "One UI",
  description: "Once UI is an open-source design system and component library for Next.js.",
  email: "",
};

// social links
const social = {
  twitter: "https://www.twitter.com/_onceui",
  linkedin: "https://www.linkedin.com/company/once-ui/",
  discord: "https://discord.com/invite/5EyAQ4eNdS",
};

export { baseURL, style, meta, og, schema, social };
