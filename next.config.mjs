/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  images: {
    remotePatterns: [
      {
        hostname: 'skill.collegejaankaar.in'
      }
    ]
  },
  reactStrictMode: false
};

export default nextConfig;
