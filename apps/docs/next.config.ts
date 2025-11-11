import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/home",
        statusCode: 301,
      },
    ];
  },
};
const withMDX = createMDX({});

export default withMDX(nextConfig);
