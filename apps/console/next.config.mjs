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
        hostname: "localhost",
      },
      {
        hostname: "api.nuvix.in",
      },
    ],
  },
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
