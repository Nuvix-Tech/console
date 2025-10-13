import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  redirects: async () => {
    // TEMP redirect
    return [
      {
        source: "/",
        destination: "/quick",
        statusCode: 302,
      },
    ];
  },
};
const withMDX = createMDX({});

export default withMDX(nextConfig);
