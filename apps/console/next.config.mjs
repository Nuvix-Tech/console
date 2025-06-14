/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@nuvix/sui"],
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  images: {
    remotePatterns: [
      {
        hostname: "api.nuvix.in",
      },
      {
        hostname: "strapi.collegejaankaar.in",
      },
    ],
  },
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
