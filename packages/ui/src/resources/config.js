const APP_NAME = "Nuvix";

const baseURL = "https://nuvix.in";

// default customization applied to the HTML in the main layout.tsx
const style = {
  theme: "dark", // dark | light
  neutral: "gray", // sand | gray | slate
  brand: "custom", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  accent: "custom", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  solid: "color", // color | contrast | inverse
  solidStyle: "plastic", // flat | plastic
  border: "conservative", // rounded | playful | conservative
  surface: "filled", // filled | translucent
  transition: "all", // all | micro | macro
  scaling: "100", // 90 | 95 | 100 | 105 | 110
};

// default metadata
const meta = {
  title: `${APP_NAME}`,
  description:
    "Nuvix is a Backend as a Service (BaaS) platform that provides a comprehensive set of tools and services to help developers build, deploy, and scale their applications quickly and easily.",
};

// default open graph data
const og = {
  title: "Nuvix",
  description:
    "Nuvix is a Backend as a Service (BaaS) platform that provides a comprehensive set of tools and services to help developers build, deploy, and scale their applications quickly and easily.",
  type: "website",
  image: "/images/cover.jpg",
};

// default schema data
const schema = {
  logo: "",
  type: "Organization",
  name: "Nuvix",
  description:
    "Nuvix is a Backend as a Service (BaaS) platform that provides a comprehensive set of tools and services to help developers build, deploy, and scale their applications quickly and easily.",
  email: "",
};

// social links
const social = {
  twitter: "https://www.twitter.com/nuvix",
  linkedin: "https://www.linkedin.com/company/nuvix/",
  discord: "https://discord.com/invite/5",
};

export { baseURL, style, meta, og, schema, social };
