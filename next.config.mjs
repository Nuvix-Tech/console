/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  images: {
    remotePatterns: [
      {
        hostname: 'api.nuvix.in'
      }
    ]
  },
  reactStrictMode: true
};

export default nextConfig;
